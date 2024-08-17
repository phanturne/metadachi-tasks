"use client";

import { NewRewardButton } from "@/components/rewards/new-reward-button";
import { RewardsList } from "@/components/rewards/rewards-list";
import { NewTaskButton } from "@/components/tasks/new-task-button";
import { TasksList } from "@/components/tasks/tasks-list";
import { useUserRewards } from "@/lib/hooks/use-rewards";
import { useSession } from "@/lib/hooks/use-session";
import { useTasksWithInstances } from "@/lib/hooks/use-tasks";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

const TasksRewardsCard = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const initialView = searchParams.get("view") || "tasks";
	const [activeView, setActiveView] = useState(initialView);

	useEffect(() => {
		router.replace(`?view=${activeView}`);
	}, [activeView, router]);

	const { session } = useSession();
	const userId = session?.user.id || "";
	const { tasks, loading: tasksLoading } = useTasksWithInstances(userId);
	const { rewards, loading: rewardsLoading } = useUserRewards(userId);

	const handleViewChange = (view: string) => {
		setActiveView(view);
	};

	return (
		<Card className="flex w-full flex-col rounded-lg px-4 pb-4">
			<CardHeader className="flex items-center justify-between">
				<ViewToggle activeView={activeView} onViewChange={handleViewChange} />
				<ActionButton activeView={activeView} />
			</CardHeader>

			<CardBody className="flex flex-col gap-2 overflow-y-scroll">
				{activeView === "tasks" ? (
					<TasksList tasks={tasks} loading={tasksLoading} session={session} />
				) : (
					<RewardsList
						rewards={Array.isArray(rewards) ? rewards : [rewards]}
						loading={rewardsLoading}
					/>
				)}
			</CardBody>
		</Card>
	);
};

interface ViewToggleProps {
	activeView: string;
	onViewChange: (view: string) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
	activeView,
	onViewChange,
}) => (
	<div className="flex items-center gap-2">
		<Button
			variant={activeView === "tasks" ? "bordered" : "light"}
			onPress={() => onViewChange("tasks")}
			className={`text-xl ${activeView === "tasks" ? "font-bold" : ""}`}
		>
			Tasks
		</Button>
		<p className="px-1">/</p>
		<Button
			variant={activeView === "rewards" ? "bordered" : "light"}
			onPress={() => onViewChange("rewards")}
			className={`text-xl ${activeView === "rewards" ? "font-bold" : ""}`}
		>
			Rewards
		</Button>
	</div>
);

interface ActionButtonProps {
	activeView: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ activeView }) => (
	<div className="flex">
		{activeView === "tasks" ? <NewTaskButton /> : <NewRewardButton />}
	</div>
);

export default TasksRewardsCard;
