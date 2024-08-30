import { Chat } from "@/components/chat/chat";
import LeaderboardCard from "@/components/leaderboard-card";
import StatsCard from "@/components/stats-card";
import TasksCard from "@/components/tasks/task-reward-card";
import { AI } from "@/lib/chat/actions";
import { generateId } from "ai";

export default function TasksPage() {
	const id = generateId();

	return (
		<div className="flex w-full shrink flex-grow gap-4 overflow-hidden px-6 pb-4">
			{/* Left Panel */}
			<div className="flex flex-grow flex-col gap-4" style={{ flex: 3 }}>
				{/* Upper Left Panel*/}
				<div className="flex flex-grow gap-4" style={{ flex: 1 }}>
					<div className="flex flex-grow" style={{ flex: 1 }}>
						<StatsCard />
					</div>
					<div className="flex flex-grow" style={{ flex: 1 }}>
						<LeaderboardCard />
					</div>
				</div>

				{/* Bottom Left Panel */}
				<div
					className="flex h-full flex-grow overflow-auto"
					style={{ flex: 2 }}
				>
					<TasksCard />
				</div>
			</div>

			{/* Right Panel */}
			<div className="flex flex-grow" style={{ flex: 2 }}>
				<AI initialAIState={{ chatId: id, messages: [] }}>
					<Chat />
				</AI>
			</div>
		</div>
	);
}
