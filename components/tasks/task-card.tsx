"use client";

import { NewRewardButton } from "@/components/rewards/new-reward-button";
import RewardItem from "@/components/rewards/reward-item";
import rewards from "@/components/rewards/sample-rewards";
import { NewTaskButton } from "@/components/tasks/new-task-button";
import { TaskItem } from "@/components/tasks/task-item";
import { useSession } from "@/lib/hooks/use-session";
import { useTasksWithInstances } from "@/lib/hooks/use-tasks";
import { Icon } from "@iconify/react";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Skeleton,
} from "@nextui-org/react";
import React, { useState } from "react";

const TasksRewardsCard = () => {
	const [activeView, setActiveView] = useState("tasks");
	const { session } = useSession();
	const userId = session?.user.id || "";
	const { tasks, loading } = useTasksWithInstances(userId);

	const renderContent = () => {
		if (activeView === "tasks") {
			return (
				<>
					{loading ? (
						<>
							{Array.from({ length: 6 }).map((_, index) => (
								<Skeleton key={index} className="h-12 rounded-lg mb-2" />
							))}
						</>
					) : tasks.length === 0 ? (
						<div className="h-full w-full flex flex-col items-center justify-center text-center space-y-4">
							<Icon
								icon="solar:checklist-bold"
								className="size-28 text-green-500"
							/>
							<p className="text-lg">
								{session
									? "All tasks done! You're on fire today!"
									: "No tasks yet. Start by adding something to do!"}
							</p>
						</div>
					) : (
						<div className="flex flex-col gap-2">
							{tasks.map((task) => {
								const firstUncompletedIndex = task.instances.findIndex(
									(instance) => !instance.is_completed,
								);
								if (firstUncompletedIndex !== -1) {
									return (
										<TaskItem
											key={task.id}
											task={task}
											instance={firstUncompletedIndex}
										/>
									);
								}
								return null;
							})}
						</div>
					)}
				</>
			);
		}

		return (
			<div className="my-auto grid max-w-7xl grid-cols-1 gap-5 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{rewards.map((reward) => (
					<RewardItem key={reward.id} {...reward} />
				))}
			</div>
		);
	};

	return (
		<Card className="px-4 rounded-lg w-full flex flex-col pb-4">
			<CardHeader className="flex justify-between items-center">
				<div className="flex items-center gap-2">
					<Button
						variant={activeView === "tasks" ? "bordered" : "light"}
						onPress={() => setActiveView("tasks")}
						className={`text-xl ${activeView === "tasks" ? "font-bold" : ""}`}
					>
						Tasks
					</Button>
					<p className="px-1">/</p>
					<Button
						variant={activeView === "rewards" ? "bordered" : "light"}
						onPress={() => setActiveView("rewards")}
						className={`text-xl ${activeView === "rewards" ? "font-bold" : ""}`}
					>
						Rewards
					</Button>
				</div>
				<div className="flex">
					{activeView === "tasks" && <NewTaskButton />}
					{activeView === "rewards" && <NewRewardButton />}
				</div>
			</CardHeader>

			<CardBody className="flex flex-col gap-2 overflow-y-scroll">
				{renderContent()}
			</CardBody>
		</Card>
	);
};

export default TasksRewardsCard;
