import { Button, Card, Checkbox } from "@nextui-org/react";
import React from "react";

export const TaskItem = ({ task, onIncrement, onDecrement, onClick }) => (
	<Card
		isPressable
		className="flex flex-row justify-between items-center p-4 cursor-pointer w-full"
		onClick={() => onClick(task)}
	>
		<Checkbox checked={task.finishedToday} />
		<div>
			<p h4>{task.name}</p>
			<p>Times finished today: {task.finishedToday}</p>
		</div>
		<div className="flex space-x-2">
			<Button
				auto
				color="success"
				onClick={(e) => {
					e.stopPropagation();
					onIncrement(task.id);
				}}
			>
				+
			</Button>
			<Button
				auto
				color="error"
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
