"use client";

import { TaskItem } from "@/components/tasks/task-item";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TaskWithInstances } from "@/lib/db/tasks";
import { Icon } from "@iconify/react";
import type { Session } from "@supabase/auth-js";
import React from "react";

export const TasksList = ({
	tasks,
	loading,
	session,
}: {
	tasks: TaskWithInstances[];
	loading: boolean;
	session: Session | null;
}) => {
	if (loading) {
		return (
			<>
				{Array.from({ length: 6 }).map((_, index) => (
					<Card key={index} className="mb-4">
						<CardContent className="p-4">
							<Skeleton className="h-4 w-[250px]" />
							<Skeleton className="mt-2 h-4 w-[200px]" />
						</CardContent>
					</Card>
				))}
			</>
		);
	}

	const displayedTaskList = tasks
		.filter((task) =>
			task.instances?.some((instance) => !instance.is_completed),
		)
		.map((task) => {
			const firstUncompletedIndex = task.instances.findIndex(
				(instance) => !instance.is_completed,
			);
			return (
				<TaskItem key={task.id} task={task} instance={firstUncompletedIndex} />
			);
		});

	if (displayedTaskList.length === 0) {
		return (
			<div className="flex h-full w-full flex-col items-center justify-center space-y-4 text-center">
				<Icon icon="solar:checklist-bold" className="size-28 text-green-500" />
				<p className="text-lg">
					{session
						? "All tasks done! You're on fire today!"
						: "No tasks yet. Start by adding something to do!"}
				</p>
			</div>
		);
	}

	return <div className="flex flex-col gap-1">{displayedTaskList}</div>;
};
