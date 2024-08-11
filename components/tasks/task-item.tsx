import { TaskModal } from "@/components/tasks/task-item-modal";
import type { TaskWithInstances } from "@/lib/db/tasks";
import {
	deleteTaskInstance,
	updateTask,
	updateTaskInstance,
} from "@/lib/db/tasks";
import { useSession } from "@/lib/hooks/use-session";
import { markStatsAsStale } from "@/lib/hooks/use-stats";
import { markTasksAsStale } from "@/lib/hooks/use-tasks";
import { formatDateTime } from "@/lib/utils";
import type { Tables } from "@/supabase/types";
import { Button, Card, Checkbox, useDisclosure } from "@nextui-org/react";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function TaskItem({
	task,
	instance,
}: { task: TaskWithInstances; instance: number }) {
	const { session } = useSession();
	const [localInstance, setLocalInstance] = useState<Tables<"task_instances">>(
		task?.instances[instance] ?? {},
	);

	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		setLocalInstance(task?.instances[instance] ?? {});
	}, [task, instance]);

	const onCardClick = () => {
		onOpen();
	};

	const onCheckboxClick = () => {
		if (!localInstance) return;

		const updatedInstance = {
			...localInstance,
			is_completed: !localInstance.is_completed,
			completed_parts: Math.min(
				localInstance.completed_parts ?? 0,
				(localInstance.total_parts ?? 0) - 1,
			),
		};

		setLocalInstance(updatedInstance);
		updateTaskInstance(localInstance.id, updatedInstance);

		// TODO: Investigate why StatsCard won't update when the if statement is removed.
		if (updatedInstance.is_completed) {
			markStatsAsStale(session?.user?.id ?? "");
		}
		// markStatsAsStale(session?.user?.id ?? "");
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

	const onDelete = () => {
		if (!localInstance) return;
		try {
			deleteTaskInstance(localInstance.id);
			setLocalInstance({} as Tables<"task_instances">);
			markStatsAsStale(session?.user?.id ?? "");
			markTasksAsStale(session?.user?.id ?? "");
			toast.success("Task deleted successfully");
		} catch (error) {
			toast.error("Failed to delete task");
		}
	};

	// TODO: Create Supabase function to update both task_instance and task instead of using 2 queries
	const onSave = (
		task: Tables<"tasks">,
		instance: Tables<"task_instances">,
	) => {
		updateTask(task.id, task);
		updateTaskInstance(instance.id, instance);

		try {
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
	const canDecrement = (localInstance.completed_parts ?? 0) > 0;

	return (
		<>
			<Card
				isPressable
				className="flex flex-row justify-between items-center p-4 cursor-pointer w-full border border-gray-300 dark:border-gray-700"
				onClick={onCardClick}
			>
				<div className="flex gap-2">
					<Checkbox
						isSelected={localInstance.is_completed ?? false}
						onValueChange={onCheckboxClick}
					/>
					{/* TODO: Add Icon/Image */}

					<div className="flex flex-col items-start">
						<h4 className="text-lg">{task.name}</h4>
						{localInstance.end_time && (
							<p className="text-sm">
								{formatDateTime(localInstance.end_time)}
							</p>
						)}
					</div>
					{/*  TODO: Add streak for recurring tasks*/}
				</div>

				<div className="flex gap-2 items-center">
					<Button
						isIconOnly
						size="sm"
						variant="flat"
						color="success"
						className="rounded-full !size-6 text-lg"
						onClick={(e) => {
							e.stopPropagation();
							onIncrement(localInstance);
						}}
						isDisabled={!canIncrement}
					>
						+
					</Button>

					<p>{`${localInstance.is_completed ? localInstance.total_parts ?? 0 : localInstance.completed_parts ?? 0} / ${localInstance.total_parts ?? 0}`}</p>

					<Button
						isIconOnly
						size="sm"
						variant="flat"
						color="danger"
						className="rounded-full !size-6 text-lg"
						onClick={(e) => {
							e.stopPropagation();
							onDecrement(localInstance);
						}}
						isDisabled={!canDecrement}
					>
						-
					</Button>
				</div>
			</Card>

			<TaskModal
				isOpen={isOpen}
				onClose={onClose}
				task={omit(task, ["instances"]) as Tables<"tasks">}
				instance={localInstance}
				onDelete={onDelete}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				onSave={onSave}
			/>
		</>
	);
}
