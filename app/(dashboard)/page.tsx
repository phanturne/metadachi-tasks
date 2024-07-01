import { Chat } from "@/components/chat";
import { AI } from "@/lib/chat/actions";

export default function HomePage() {
	return (
		<div className="flex flex-grow bg-gray-800 gap-4 mx-auto max-w-6xl w-full">
			{/* Left Panel */}
			<div className="flex flex-grow gap-4 flex-col" style={{ flex: 3 }}>
				{/* Upper Left Panel*/}
				<div className="flex flex-grow h-full gap-4" style={{ flex: 1 }}>
					<div className="flex flex-grow bg-red-500">
						<p>Stats</p>
					</div>
					<div className="flex flex-grow bg-red-800">
						<p>Leaderboard</p>
					</div>
				</div>

				{/* Bottom Left Panel */}
				<div
					className="flex flex-grow bg-yellow-700 h-full"
					style={{ flex: 2 }}
				>
					<p>Tasks</p>
				</div>
			</div>

			{/* Right Panel */}
			<div className="flex-grow bg-blue-600" style={{ flex: 2 }}>
				<AI>
					<Chat />
				</AI>
			</div>
		</div>
	);
}
