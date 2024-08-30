"use client";

import { TaskModal } from "@/components/tasks/task-item-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Calendar, Minus, Plus } from "lucide-react";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function TaskItem({
	task,
	instance,
}: {
	task: TaskWithInstances;
	instance: number;
}) {
	const { session } = useSession();
	const [localInstance, setLocalInstance] = useState<Tables<"task_instances">>(
		task?.instances[instance] ?? {},
	);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setLocalInstance(task?.instances[instance] ?? {});
	}, [task, instance]);

	const onCardClick = () => setIsOpen(true);

	const onCheckboxClick = async (checked: boolean) => {
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

	const onIncrement = (unsavedInstance: Tables<"task_instances">) => {
		if (!unsavedInstance) return;

		const completedParts = unsavedInstance.completed_parts ?? 0;
		const totalParts = unsavedInstance.total_parts ?? 0;

		if (completedParts < totalParts && !unsavedInstance.is_completed) {
			const updatedInstance = {
				...unsavedInstance,
				completed_parts: completedParts + 1,
				is_completed: completedParts + 1 === totalParts,
			};

			setLocalInstance(updatedInstance);
			updateTaskInstance(unsavedInstance.id, updatedInstance);

			if (updatedInstance.is_completed) {
				markStatsAsStale(session?.user?.id ?? "");
			}
		}
	};

	const onDecrement = (unsavedInstance: Tables<"task_instances">) => {
		if (!unsavedInstance) return;

		const completedParts = unsavedInstance.completed_parts ?? 0;

		if (completedParts > 0 && !unsavedInstance.is_completed) {
			const updatedInstance = {
				...unsavedInstance,
				completed_parts: completedParts - 1,
				is_completed: false,
			};

			setLocalInstance(updatedInstance);
			updateTaskInstance(unsavedInstance.id, updatedInstance);
		}
	};

	const onDeleteInstance = async () => {
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

	const onDeleteTask = async () => {
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

	const onSave = async (
		task: Tables<"tasks">,
		instance: Tables<"task_instances">,
	) => {
		try {
			await Promise.all([
				updateTask(task.id, task),
				updateTaskInstance(instance.id, instance),
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
			<Button
				variant="outline"
				className="flex w-full items-center justify-between p-4 py-8 text-left"
				onClick={onCardClick}
			>
				<div className="flex items-center gap-4">
					<Checkbox
						checked={localInstance.is_completed ?? false}
						onCheckedChange={onCheckboxClick}
						className="h-5 w-5"
					/>
					<div>
						<h4
							className={cn(
								"font-medium text-base",
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
				<div className="flex items-center gap-2">
					<Button
						size="icon"
						variant="ghost"
						className="h-8 w-8 rounded-full"
						onClick={(e) => {
							e.stopPropagation();
							onDecrement(localInstance);
						}}
						disabled={!canDecrement}
					>
						<Minus className="h-4 w-4" />
					</Button>
					<span className="w-12 text-center text-sm">
						{localInstance.is_completed
							? localInstance.total_parts ?? 0
							: localInstance.completed_parts ?? 0}{" "}
						/ {localInstance.total_parts ?? 0}
					</span>
					<Button
						size="icon"
						variant="ghost"
						className="h-8 w-8 rounded-full"
						onClick={(e) => {
							e.stopPropagation();
							onIncrement(localInstance);
						}}
						disabled={!canIncrement}
					>
						<Plus className="h-4 w-4" />
					</Button>
				</div>
			</Button>

			<TaskModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				task={omit(task, ["instances"]) as Tables<"tasks">}
				instance={localInstance}
				onDeleteInstance={onDeleteInstance}
				onDeleteTask={onDeleteTask}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				onSave={onSave}
			/>
		</>
	);
}
