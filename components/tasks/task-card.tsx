"use client";

import { TaskCardSettings } from "@/components/tasks/task-card-settings";
import { TaskItem } from "@/components/tasks/task-item";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";
import React, { useState } from "react";

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
	const [selectedTask, setSelectedTask] = useState(null);
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

	const handleIncrement = (taskId) => {
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

	const handleDecrement = (taskId) => {
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

	const handleTaskClick = (task) => {
		setSelectedTask(task);
		setModalVisible(true);
	};

	const handleCloseModal = () => {
		setModalVisible(false);
		setSelectedTask(null);
	};

	return (
		<div className="p-6 border border-gray-300 rounded-lg w-full flex flex-col overflow-y-scroll">
			<div className="flex justify-between mb-4">
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
			</div>
			<div className="flex flex-col gap-2">
				{tasks.map((task) => (
					<TaskItem
						key={task.id}
						task={task}
						onIncrement={handleIncrement}
						onDecrement={handleDecrement}
						onClick={handleTaskClick}
					/>
				))}
			</div>
			{/*{selectedTask && (*/}
			{/*	<TaskItemModal*/}
			{/*		task={selectedTask}*/}
			{/*		visible={modalVisible}*/}
			{/*		onClose={handleCloseModal}*/}
			{/*	/>*/}
			{/*)}*/}
		</div>
	);
};

const NewTaskButton = ({ onClick }) => (
	<Button auto shadow color="default" onClick={onClick}>
		New Task
	</Button>
);

export default TasksCard;
