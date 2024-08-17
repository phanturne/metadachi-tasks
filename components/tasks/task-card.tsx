"use client";

import { NewRewardButton } from "@/components/rewards/new-reward-button";
import {
	RewardItem,
	RewardItemSkeleton,
} from "@/components/rewards/reward-item";
import { EmptyRewardsList } from "@/components/rewards/rewards-list";
import { NewTaskButton } from "@/components/tasks/new-task-button";
import { TaskItem } from "@/components/tasks/task-item";
import { useUserRewards } from "@/lib/hooks/use-rewards";
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
	const { rewards, loading: rewardsLoading } = useUserRewards(userId);

	const displayedTaskList = tasks
		.filter((task) => task.instances.some((instance) => !instance.is_completed))
		.map((task) => {
			const firstUncompletedIndex = task.instances.findIndex(
				(instance) => !instance.is_completed,
			);
			return (
				<TaskItem key={task.id} task={task} instance={firstUncompletedIndex} />
			);
		});

	const renderContent = () => {
		if (activeView === "tasks") {
			return (
				<>
					{loading ? (
						<>
							{Array.from({ length: 6 }).map((_, index) => (
								<Skeleton key={index} className="mb-2 h-12 rounded-lg" />
							))}
						</>
					) : displayedTaskList.length === 0 ? (
						<div className="flex h-full w-full flex-col items-center justify-center space-y-4 text-center">
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
						<div className="flex flex-col gap-2">{displayedTaskList}</div>
					)}
				</>
			);
		}

		return (
			<>
				{loading ? (
					<>
						{Array.from({ length: 6 }).map((_, index) => (
							<RewardItemSkeleton key={index} />
						))}
					</>
				) : rewards.length === 0 ? (
					<EmptyRewardsList />
				) : (
					<div className="grid max-w-7xl grid-cols-1 gap-5 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
						{rewards.map((reward) => (
							<RewardItem key={reward.id} {...reward} />
						))}
					</div>
				)}
			</>
		);
	};

	return (
		<Card className="flex w-full flex-col rounded-lg px-4 pb-4">
			<CardHeader className="flex items-center justify-between">
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
