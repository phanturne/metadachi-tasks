"use client";

import { GoldStatsChart } from "@/components/stats-chart";
import { getUserStats } from "@/lib/db/user_stats";
import { useSession } from "@/lib/hooks/use-session";
import { Icon } from "@iconify/react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

export default function StatsCard() {
	const { session } = useSession();
	const userId = session?.user.id || "";

	const [stats, setStats] = useState([]);
	const [dates, setDates] = useState({ startDate: "", endDate: "" });

	useEffect(() => {
		const end = new Date();
		const start = new Date(end);
		start.setDate(start.getDate() - 6);

		setDates({
			startDate: start.toISOString().split("T")[0],
			endDate: end.toISOString().split("T")[0],
		});
	}, []);

	useEffect(() => {
		const fetchStats = async () => {
			if (!userId || !dates.startDate || !dates.endDate) return;
			try {
				const fetchedStats = await getUserStats(
					userId,
					dates.startDate,
					dates.endDate,
				);
				setStats(fetchedStats ?? []);
			} catch (error) {
				console.error("Error fetching user stats:", error);
			}
		};

		fetchStats();
	}, [userId, dates]);

	const todaysStats = stats?.[0] ?? {};
	const yesterdayStats = stats?.[1] ?? {};
	const goldChange =
		(todaysStats.gold_earned ?? 0) - (todaysStats.gold_spent ?? 0);
	const tasksCompletedToday =
		stats.length >= 2
			? (todaysStats.tasks_completed ?? 0) -
				(yesterdayStats.tasks_completed ?? 0)
			: todaysStats.tasks_completed ?? 0;

	return (
		<Card className="px-4 rounded-lg w-full flex flex-col overflow-y-scroll">
			<CardHeader className="flex justify-between">
				<h1 className="text-xl bold">Stats</h1>
			</CardHeader>
			<CardBody className="overflow-visible">
				{/* Points */}
				<div className="flex items-center">
					<span className="font-semibold">Gold:</span>
					<span className="ml-2">{todaysStats.total_gold ?? 0}</span>
					{goldChange >= 0 ? (
						<div className="flex items-center text-green-500 ml-2">
							<Icon icon="solar:alt-arrow-up-bold" width={24} />
							<span className="ml-1">{goldChange}</span>
						</div>
					) : (
						<div className="flex items-center text-red-500 ml-2">
							<Icon icon="solar:alt-arrow-down-bold" width={24} />
							<span className="ml-1">{goldChange}</span>
						</div>
					)}
				</div>

				{/* Tasks Completed Today */}
				<p className="flex items-center">
					<span className="font-semibold">Tasks Completed Today:</span>
					<span className="ml-2">{tasksCompletedToday}</span>
				</p>

				<GoldStatsChart
					stats={stats}
					startDate={dates.startDate}
					endDate={dates.endDate}
				/>
			</CardBody>
		</Card>
	);
}
