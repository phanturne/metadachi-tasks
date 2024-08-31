"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Medal, Trophy } from "lucide-react";
import React from "react";

const leaderboardData = [
	{ name: "Alice", score: 1000 },
	{ name: "Bob", score: 950 },
	{ name: "Charlie", score: 900 },
	{ name: "David", score: 850 },
	{ name: "Eve", score: 800 },
	{ name: "Frank", score: 750 },
	{ name: "Grace", score: 700 },
	{ name: "Henry", score: 650 },
	{ name: "Ivy", score: 600 },
	{ name: "Jack", score: 550 },
];

export default function LeaderboardCard() {
	return (
		<Card className="flex h-full w-full flex-col bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
			<CardHeader className="flex-shrink-0">
				<CardTitle className="flex items-center gap-2 font-bold text-xl">
					<Trophy className="h-6 w-6 text-yellow-500" />
					Leaderboard
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-grow overflow-hidden">
				<div className="relative h-full">
					{/* Overlay */}
					<div className="absolute inset-0 z-10 flex items-center justify-center">
						<p className="animate-pulse font-bold text-2xl text-primary">
							Coming soon...
						</p>
					</div>

					{/* Leaderboard data container */}
					<ScrollArea className="h-full blur-sm">
						<div className="flex flex-col gap-2 p-1">
							{leaderboardData.map((entry, index) => (
								<div
									key={entry.name}
									className="flex items-center justify-between border-b transition-colors last:border-b-0 hover:bg-muted/50"
								>
									<div className="flex items-center gap-3">
										{index < 3 ? (
											<Medal
												className={`h-5 w-5 ${
													index === 0
														? "text-yellow-500"
														: index === 1
															? "text-gray-400"
															: "text-amber-600"
												}`}
											/>
										) : (
											<span className="flex h-5 w-5 items-center justify-center font-semibold text-muted-foreground">
												{index + 1}
											</span>
										)}
										<span className="font-medium">{entry.name}</span>
									</div>
									<Badge variant="secondary" className="font-mono">
										{entry.score.toLocaleString()}
									</Badge>
								</div>
							))}
						</div>
					</ScrollArea>
				</div>
			</CardContent>
		</Card>
	);
}
