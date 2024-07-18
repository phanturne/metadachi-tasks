import { TaskModal } from "@/components/tasks/task-item-modal";
import type { TaskWithInstances } from "@/lib/db/tasks";
import { updateTaskInstance } from "@/lib/db/tasks";
import type { Tables } from "@/supabase/types";
import { Button, Card, Checkbox, useDisclosure } from "@nextui-org/react";
import type React from "react";
import { useEffect, useState } from "react";

export function TaskItem({
	task,
	instance,
}: { task: TaskWithInstances; instance: number }) {
	const [localInstance, setLocalInstance] = useState<
		Tables<"task_instances"> | undefined
	>(task?.instances[instance] as Tables<"task_instances"> | undefined);

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	useEffect(() => {
		setLocalInstance(
			task?.instances[instance] as Tables<"task_instances"> | undefined,
		);
	}, [task, instance]);

	const onCardClick = () => {
		onOpen();
	};

	const onCheckboxClick = () => {
		if (!localInstance) return;

		const updatedInstance = {
			...localInstance,
			is_completed: !localInstance.is_completed,
		};

		setLocalInstance(updatedInstance);
		updateTaskInstance(localInstance.id, updatedInstance);
	};

	const onIncrement = () => {
		if (!localInstance) return;

		const completedParts = localInstance.completed_parts ?? 0;
		const totalParts = localInstance.total_parts ?? 0;

		if (completedParts < totalParts && !localInstance.is_completed) {
			const updatedInstance = {
				...localInstance,
				completed_parts: completedParts + 1,
			};

			setLocalInstance(updatedInstance);
			updateTaskInstance(localInstance.id, updatedInstance);
		}
	};

	const onDecrement = () => {
		if (!localInstance) return;

		const completedParts = localInstance.completed_parts ?? 0;

		if (completedParts > 0 && !localInstance.is_completed) {
			const updatedInstance = {
				...localInstance,
				completed_parts: completedParts - 1,
			};

			setLocalInstance(updatedInstance);
			updateTaskInstance(localInstance.id, updatedInstance);
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
			<Card
				isPressable
				className="flex flex-row justify-between items-center p-4 cursor-pointer w-full"
				onClick={onCardClick}
			>
				<div className="flex gap-2">
					<Checkbox
						checked={localInstance.is_completed ?? false}
						onValueChange={onCheckboxClick}
					/>
					{/* TODO: Add Icon/Image */}

					<div className="flex flex-col items-start">
						<h4 className="text-lg">{task.name}</h4>
						{localInstance.end_time && (
							<p className="text-sm">Due: {task.end_time}</p>
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
						className="rounded-full !size-6"
						onClick={(e) => {
							e.stopPropagation();
							onIncrement();
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
						className="rounded-full !size-6"
						onClick={(e) => {
							e.stopPropagation();
							onDecrement();
						}}
						isDisabled={!canDecrement}
					>
						-
					</Button>
				</div>
			</Card>

			<TaskModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				task={task}
				instance={localInstance}
			/>
		</>
	);
}
