import { Chat } from "@/components/chat/chat";
import LeaderboardCard from "@/components/leaderboard-card";
import StatsCard from "@/components/stats-card";
import TasksCard from "@/components/tasks/task-card";
import { AI } from "@/lib/chat/actions";

export default function HomePage() {
	return (
		<div className="flex flex-grow gap-4 px-6 w-full overflow-hidden pb-4 shrink">
			{/* Left Panel */}
			<div className="flex flex-grow gap-4 flex-col" style={{ flex: 3 }}>
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
				<div className="flex flex-grow h-full" style={{ flex: 2 }}>
					<TasksCard />
				</div>
			</div>

			{/* Right Panel */}
			<div className="flex flex-grow" style={{ flex: 2 }}>
				<AI>
					<Chat />
				</AI>
			</div>
		</div>
	);
}
