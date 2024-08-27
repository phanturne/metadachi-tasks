"use client";

import { NewRewardButton } from "@/components/rewards/new-reward-button";
import { RewardsList } from "@/components/rewards/rewards-list";
import { NewTaskButton } from "@/components/tasks/new-task-button";
import { TasksList } from "@/components/tasks/tasks-list";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserRewards } from "@/lib/hooks/use-rewards";
import { useSession } from "@/lib/hooks/use-session";
import { useTasksWithInstances } from "@/lib/hooks/use-tasks";
import { Gift, ListTodo } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
		<Card className="w-full overflow-hidden bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-gray-900 dark:to-gray-800">
			<CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
				<Tabs
					value={activeView}
					onValueChange={handleViewChange}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-2 bg-white/20 dark:bg-black/20">
						<TabsTrigger
							value="tasks"
							className="data-[state=active]:bg-white data-[state=active]:text-violet-700 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-violet-400"
						>
							<ListTodo className="mr-2 h-4 w-4" />
							Tasks
						</TabsTrigger>
						<TabsTrigger
							value="rewards"
							className="data-[state=active]:bg-white data-[state=active]:text-fuchsia-700 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-fuchsia-400"
						>
							<Gift className="mr-2 h-4 w-4" />
							Rewards
						</TabsTrigger>
					</TabsList>
				</Tabs>
				<ActionButton activeView={activeView} />
			</CardHeader>
			<CardContent>
				{activeView === "tasks" ? (
					<TasksList tasks={tasks} loading={tasksLoading} session={session} />
				) : (
					<RewardsList rewards={rewards} loading={rewardsLoading} />
				)}
			</CardContent>
		</Card>
	);
};

interface ActionButtonProps {
	activeView: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ activeView }) => (
	<div className="flex">
		{activeView === "tasks" ? <NewTaskButton /> : <NewRewardButton />}
	</div>
);

export default TasksRewardsCard;
