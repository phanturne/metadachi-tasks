"use client";

import { TaskCardSettings } from "@/components/tasks/task-card-settings";
import { TaskItem } from "@/components/tasks/task-item";
import { Icon } from "@iconify/react";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import type React from "react";
import { useState } from "react";

export interface Task {
	id: number;
	name: string;
	finishedToday: number;
	totalTimes: number;
}

// const TaskItemModal = ({ task, visible, onClose }) => (
// 	<Modal closeButton blur open={visible} onClose={onClose}>
// 		<Modal.Header>
// 			<p size={18}>{task.name}</p>
// 		</Modal.Header>
// 		<Modal.Body>
// 			<p>Times finished today: {task.finishedToday}</p>
// 			<p>Total times: {task.totalTimes}</p>
// 		</Modal.Body>
// 		<Modal.Footer>
// 			<Button auto flat color="error" onClick={onClose}>
// 				Close
// 			</Button>
// 		</Modal.Footer>
// 	</Modal>
// );

const TasksCard = () => {
	const [tasks, setTasks] = useState([
		{ id: 1, name: "Task 1", finishedToday: 0, totalTimes: 0 },
		{ id: 2, name: "Task 2", finishedToday: 0, totalTimes: 0 },
	]);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [modalVisible, setModalVisible] = useState(false);

	const handleNewTask = () => {
		const newTask = {
			id: tasks.length + 1,
			name: `Task ${tasks.length + 1}`,
			finishedToday: 0,
			totalTimes: 0,
		};
		setTasks([...tasks, newTask]);
	};

	const handleIncrement = (taskId: number) => {
		setTasks(
			tasks.map((task) =>
				task.id === taskId
					? {
							...task,
							finishedToday: task.finishedToday + 1,
							totalTimes: task.totalTimes + 1,
						}
					: task,
			),
		);
	};

	const handleDecrement = (taskId: number) => {
		setTasks(
			tasks.map((task) =>
				task.id === taskId && task.finishedToday > 0
					? {
							...task,
							finishedToday: task.finishedToday - 1,
							totalTimes: task.totalTimes - 1,
						}
					: task,
			),
		);
	};

	const handleTaskClick = (task: Task) => {
		setSelectedTask(task);
		setModalVisible(true);
	};

	const handleCloseModal = () => {
		setModalVisible(false);
		setSelectedTask(null);
	};

	return (
		<Card className="px-4 rounded-lg w-full flex flex-col overflow-y-scroll">
			<CardHeader className="flex justify-between">
				<h1 className="text-xl bold">Tasks</h1>
				{/* TODO: Add row of selectable chips for All, Morning, Afternoon, Evening, Today, Week, Month, Year */}
				<div className="flex">
					<Button isIconOnly radius="full" variant="light">
						<Icon icon="solar:filter-bold-duotone" width={24} />
					</Button>
					<Button isIconOnly radius="full" variant="light" color="primary">
						<Icon icon="solar:sort-vertical-bold-duotone" width={24} />
					</Button>
					<TaskCardSettings />
					<NewTaskButton onClick={handleNewTask} />
				</div>
			</CardHeader>
			<CardBody className="flex flex-col gap-2">
				{tasks.map((task) => (
					<TaskItem
						key={task.id}
						task={task}
						onIncrement={handleIncrement}
						onDecrement={handleDecrement}
						onClick={handleTaskClick}
					/>
				))}
			</CardBody>
			{/*{selectedTask && (*/}
			{/*	<TaskItemModal*/}
			{/*		task={selectedTask}*/}
			{/*		visible={modalVisible}*/}
			{/*		onClose={handleCloseModal}*/}
			{/*	/>*/}
			{/*)}*/}
		</Card>
	);
};

const NewTaskButton = ({
	onClick,
}: { onClick: (event: React.MouseEvent<HTMLButtonElement>) => void }) => (
	<Button color="default" onClick={onClick}>
		New Task
	</Button>
);

export default TasksCard;
