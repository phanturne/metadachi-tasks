"use client";

import { NewTaskButton } from "@/components/tasks/new-task-button";
import { TaskCardSettings } from "@/components/tasks/task-card-settings";
import { TaskItem } from "@/components/tasks/task-item";
import { useSession } from "@/lib/hooks/use-session";
import { useTasksWithInstances } from "@/lib/hooks/use-tasks";
import { Icon } from "@iconify/react";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import type React from "react";

const TasksCard = () => {
	const { session } = useSession();
	const userId = session?.user.id || "";
	const { tasks, loading, error } = useTasksWithInstances(userId);

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
					<NewTaskButton />
				</div>
			</CardHeader>

			<CardBody className="flex flex-col gap-2">
				{loading ? (
					<div>Loading...</div>
				) : tasks.length === 0 ? (
					<div>No tasks found</div>
				) : (
					tasks.map(
						(task) =>
							task.instances.length > 0 && (
								<div key={task.id}>
									{task.instances.map((_, index) => (
										<TaskItem
											key={`${task.id}-${index}`}
											task={task}
											instance={index}
										/>
									))}
								</div>
							),
					)
				)}
			</CardBody>
		</Card>
	);
};

export default TasksCard;
