"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";
import React from "react";

const leaderboardData = [
	{ name: "Alice", score: 1000 },
	{ name: "Bob", score: 950 },
	{ name: "Charlie", score: 900 },
];

export default function LeaderboardCard() {
	return (
		<Card className="px-4 rounded-lg w-full flex flex-col overflow-y-scroll">
			<CardHeader className="flex justify-between">
				<h1 className="text-xl bold">Leaderboard</h1>
			</CardHeader>
			<CardBody className="overflow-visible">
				{leaderboardData.map((entry, index) => (
					<div
						key={entry.name}
						className="flex justify-between items-center py-2 border-b border-gray-200"
					>
						<div className="flex items-center">
							<span className="font-semibold">
								{index + 1}. {entry.name}
							</span>
						</div>
						<div className="flex items-center">
							<span className="ml-2">{entry.score}</span>
						</div>
					</div>
				))}
			</CardBody>
		</Card>
	);
}
