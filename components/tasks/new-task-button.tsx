import { Button } from "@nextui-org/react";
import type React from "react";

export const NewTaskButton = () => {
	const handleNewTask = () => {
		// const newTask = {
		// 	id: tasks.length + 1,
		// 	name: `Task ${tasks.length + 1}`,
		// 	finishedToday: 0,
		// 	totalTimes: 0,
		// };
		// setTasks([...tasks, newTask]);
	};

	return (
		<Button color="default" onClick={handleNewTask}>
			New Task
		</Button>
	);
};
