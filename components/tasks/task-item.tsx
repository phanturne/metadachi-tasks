import { TaskModal } from "@/components/tasks/task-item-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TaskWithInstances } from "@/lib/db/tasks";
import {
	deleteTask,
	deleteTaskInstance,
	updateTask,
	updateTaskInstance,
} from "@/lib/db/tasks";
import { useSession } from "@/lib/hooks/use-session";
import { markStatsAsStale } from "@/lib/hooks/use-stats";
import { markTasksAsStale } from "@/lib/hooks/use-tasks";
import { cn, formatDateTime } from "@/lib/utils";
import type { Tables } from "@/supabase/types";
import { Calendar, Minus, MoreVertical, Plus } from "lucide-react";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export function TaskItem({
	task,
	instance,
}: { task: TaskWithInstances; instance: number }) {
	const { session } = useSession();
	const [localInstance, setLocalInstance] = useState<Tables<"task_instances">>(
		task?.instances[instance] ?? {},
	);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setLocalInstance(task?.instances[instance] ?? {});
	}, [task, instance]);

	const handleCheckboxChange = async (checked: boolean) => {
		if (!localInstance) return;

		const updatedInstance = {
			...localInstance,
			is_completed: checked,
			completed_parts: checked
				? localInstance.total_parts
				: Math.min(
						localInstance.completed_parts ?? 0,
						(localInstance.total_parts ?? 0) - 1,
					),
		};

		setLocalInstance(updatedInstance);
		await updateTaskInstance(localInstance.id, updatedInstance);
		markStatsAsStale(session?.user?.id ?? "");
	};

	const handleIncrement = () => {
		if (!localInstance) return;

		const completedParts = localInstance.completed_parts ?? 0;
		const totalParts = localInstance.total_parts ?? 0;

		if (completedParts < totalParts && !localInstance.is_completed) {
			const updatedInstance = {
				...localInstance,
				completed_parts: completedParts + 1,
				is_completed: completedParts + 1 === totalParts,
			};

			setLocalInstance(updatedInstance);
			updateTaskInstance(localInstance.id, updatedInstance);

			if (updatedInstance.is_completed) {
				markStatsAsStale(session?.user?.id ?? "");
			}
		}
	};

	const handleDecrement = () => {
		if (!localInstance) return;

		const completedParts = localInstance.completed_parts ?? 0;

		if (completedParts > 0 && !localInstance.is_completed) {
			const updatedInstance = {
				...localInstance,
				completed_parts: completedParts - 1,
				is_completed: false,
			};

			setLocalInstance(updatedInstance);
			updateTaskInstance(localInstance.id, updatedInstance);
		}
	};

	const handleDeleteInstance = async () => {
		if (!localInstance) return;
		try {
			await deleteTaskInstance(localInstance.id);
			setLocalInstance({} as Tables<"task_instances">);
			markStatsAsStale(session?.user?.id ?? "");
			markTasksAsStale(session?.user?.id ?? "");
			toast.success("Task instance deleted successfully");
		} catch (error) {
			toast.error("Failed to delete task instance");
		}
	};

	const handleDeleteTask = async () => {
		try {
			await deleteTask(task.id);
			setLocalInstance({} as Tables<"task_instances">);
			markStatsAsStale(session?.user?.id ?? "");
			markTasksAsStale(session?.user?.id ?? "");
			toast.success("Task deleted successfully");
		} catch (error) {
			toast.error("Failed to delete task");
		}
	};

	const handleSave = async (
		updatedTask: Tables<"tasks">,
		updatedInstance: Tables<"task_instances">,
	) => {
		try {
			await Promise.all([
				updateTask(updatedTask.id, updatedTask),
				updateTaskInstance(updatedInstance.id, updatedInstance),
			]);

			markStatsAsStale(session?.user?.id ?? "");
			markTasksAsStale(session?.user?.id ?? "");

			toast.success("Task updated successfully");
		} catch (e) {
			toast.error("Failed to update task.");
		}
	};

	if (!localInstance) {
		return null;
	}

	const canIncrement =
		(localInstance.completed_parts ?? 0) < (localInstance.total_parts ?? 0) &&
		!localInstance.is_completed;
	const canDecrement =
		(localInstance.completed_parts ?? 0) > 0 && !localInstance.is_completed;

	return (
		<>
			<Card className="w-full">
				<CardContent className="flex min-h-[62px] items-center justify-between p-3 px-4">
					<div className="flex items-center gap-3">
						<Checkbox
							checked={localInstance.is_completed ?? false}
							onCheckedChange={handleCheckboxChange}
							className="h-4 w-4"
						/>
						<div className="flex h-full flex-col justify-between">
							<h4
								className={cn(
									"font-medium text-sm",
									localInstance.is_completed && "line-through",
								)}
							>
								{task.name}
							</h4>
							{localInstance.end_time && (
								<p className="flex items-center pt-0.5 text-muted-foreground text-xs">
									<Calendar className="mr-1 h-3 w-3" />
									{formatDateTime(localInstance.end_time)}
								</p>
							)}
						</div>
					</div>
					<div className="flex items-center gap-1">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										size="sm"
										variant="ghost"
										className="h-6 w-6 rounded-full p-0"
										onClick={handleDecrement}
										disabled={!canDecrement}
									>
										<Minus className="h-3 w-3" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Decrease progress</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<span className="w-8 text-center text-xs">
							{localInstance.is_completed
								? localInstance.total_parts ?? 0
								: localInstance.completed_parts ?? 0}
							&nbsp;/&nbsp;
							{localInstance.total_parts ?? 0}
						</span>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										size="sm"
										variant="ghost"
										className="h-6 w-6 rounded-full p-0"
										onClick={handleIncrement}
										disabled={!canIncrement}
									>
										<Plus className="h-3 w-3" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Increase progress</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										size="sm"
										variant="ghost"
										className="h-6 w-6 rounded-full p-0"
										onClick={() => setIsOpen(true)}
									>
										<MoreVertical className="h-3 w-3" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Open task details</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</CardContent>
			</Card>

			<TaskModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				task={omit(task, ["instances"]) as Tables<"tasks">}
				instance={localInstance}
				onDeleteInstance={handleDeleteInstance}
				onDeleteTask={handleDeleteTask}
				onIncrement={handleIncrement}
				onDecrement={handleDecrement}
				onSave={handleSave}
			/>
		</>
	);
}
