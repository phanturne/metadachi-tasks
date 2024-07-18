import type { TaskWithInstances } from "@/lib/db/tasks";
import { updateTaskInstance } from "@/lib/db/tasks";
import type { Tables } from "@/supabase/types";
import { Button, Card, Checkbox } from "@nextui-org/react";
import type React from "react";

export function TaskItem({
	task,
	instance,
}: { task: TaskWithInstances; instance: number }) {
	const onCardClick = () => {
		console.log("Card clicked");
	};

	const onCheckboxClick = () => {
		updateTaskInstance(taskInstanceId, {
			...task.instances[instance],
			is_completed: !task.instances[instance].is_completed,
		});
	};

	const onIncrement = () => {
		if (
			!currInstance?.completed_parts ||
			!currInstance?.total_parts ||
			currInstance.completed_parts + 1 > currInstance.total_parts
		) {
			return;
		}

		updateTaskInstance(taskInstanceId, {
			...task.instances[instance],
			completed_parts: currInstance.completed_parts + 1,
		});
	};

	const onDecrement = () => {
		if (
			!currInstance?.completed_parts ||
			!currInstance?.total_parts ||
			currInstance.completed_parts - 1 < 0
		) {
			return;
		}

		updateTaskInstance(taskInstanceId, {
			...task.instances[instance],
			completed_parts: currInstance.completed_parts - 1,
		});
	};

	const currInstance = task?.instances[instance] as
		| Tables<"task_instances">
		| undefined;

	if (!currInstance) {
		return;
	}

	const taskInstanceId = currInstance.id;

	return (
		<Card
			isPressable
			className="flex flex-row justify-between items-center p-4 cursor-pointer w-full"
			onClick={onCardClick}
		>
			<div className="flex gap-2">
				<Checkbox
					checked={currInstance.is_completed ?? false}
					onValueChange={onCheckboxClick}
				/>
				{/* TODO: Add Icon/Image */}

				<div className="flex flex-col">
					<h4 className="text-lg">{task.name}</h4>
					<p className="text-sm">Due: {task.end_time}</p>
				</div>
				{/*	TODO: Add streak for recurring tasks*/}
			</div>

			<div className="flex gap-2 items-center">
				<Button
					isIconOnly
					size="sm"
					variant="flat"
					color="success"
					className="rounded-full !size-6"
					onClick={onIncrement}
				>
					+
				</Button>

				<p>{`${currInstance.is_completed ? currInstance.total_parts : currInstance.completed_parts} / ${currInstance.total_parts}`}</p>

				<Button
					isIconOnly
					size="sm"
					variant="flat"
					color="danger"
					className="rounded-full !size-6"
					onClick={onDecrement}
				>
					-
				</Button>
			</div>
		</Card>
	);
}
