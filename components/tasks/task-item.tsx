import { Button, Card, Checkbox } from "@nextui-org/react";
import type React from "react";
import type { Task } from "./task-card";

interface TaskItemProps {
	task: Task;
	onIncrement: (taskId: number) => void;
	onDecrement: (taskId: number) => void;
	onClick: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
	task,
	onIncrement,
	onDecrement,
	onClick,
}) => (
	<Card
		isPressable
		className="flex flex-row justify-between items-center p-4 cursor-pointer w-full"
		onClick={() => onClick(task)}
	>
		<Checkbox checked={task.finishedToday > 0} />
		<div>
			<h4>{task.name}</h4>
			<p>Times finished today: {task.finishedToday}</p>
		</div>
		<div className="flex space-x-2">
			<Button
				color="success"
				onClick={(e) => {
					e.stopPropagation();
					onIncrement(task.id);
				}}
			>
				+
			</Button>
			<Button
				color="danger"
				onClick={(e) => {
					e.stopPropagation();
					onDecrement(task.id);
				}}
			>
				-
			</Button>
		</div>
	</Card>
);
