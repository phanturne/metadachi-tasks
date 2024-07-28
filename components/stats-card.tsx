"use client";

import { GoldStatsChart } from "@/components/stats-chart";
import { getUserStats } from "@/lib/db/user_stats";
import { useSession } from "@/lib/hooks/use-session";
import type { Tables } from "@/supabase/types";
import { Icon } from "@iconify/react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

type UserStat = Tables<"user_stats">;

export default function StatsCard() {
	const { session } = useSession();
	const userId = session?.user.id || "";

	const [stats, setStats] = useState<UserStat[]>([]);
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

	const todaysStats = stats[0];
	const yesterdayStats = stats[1];

	const goldChange = todaysStats
		? (todaysStats.gold_earned ?? 0) - (todaysStats.gold_spent ?? 0)
		: undefined;

	const tasksCompletedToday = calculateTasksCompletedToday(
		todaysStats,
		yesterdayStats,
	);

	return (
		<Card className="px-4 rounded-lg w-full flex flex-col overflow-y-scroll">
			<CardHeader className="flex justify-between">
				<h1 className="text-xl bold">Stats</h1>
			</CardHeader>
			<CardBody className="overflow-visible">
				<StatCardItem label="Level" value={todaysStats?.level ?? 1} />
				<StatCardItem
					label="Gold"
					value={todaysStats?.total_gold ?? 0}
					change={goldChange}
				/>
				<StatCardItem
					label="Tasks Completed Today"
					value={tasksCompletedToday}
					icon="mdi:task-complete"
				/>

				<GoldStatsChart
					stats={stats}
					startDate={dates.startDate}
					endDate={dates.endDate}
				/>
			</CardBody>
		</Card>
	);
}

function calculateTasksCompletedToday(
	todaysStats?: UserStat,
	yesterdayStats?: UserStat,
): number {
	if (!todaysStats) return 0;
	if (!yesterdayStats) return todaysStats.tasks_completed ?? 0;
	return (
		(todaysStats.tasks_completed ?? 0) - (yesterdayStats.tasks_completed ?? 0)
	);
}

const StatCardItem = ({
	label,
	value,
	change,
	icon,
}: {
	label: string;
	value: number;
	change?: number;
	icon?: string;
}) => {
	const changeColor =
		change !== undefined && change >= 0 ? "text-green-500" : "text-red-500";
	const changeIcon =
		change !== undefined && change >= 0
			? "solar:alt-arrow-up-bold"
			: "solar:alt-arrow-down-bold";

	return (
		<div className="flex items-center">
			<span className="font-semibold">{label}:</span>
			<span className="ml-2">{value}</span>
			{change !== undefined && (
				<div className={`flex items-center ${changeColor} ml-2`}>
					<Icon icon={changeIcon} width={24} />
					<span className="ml-1">{Math.abs(change)}</span>
				</div>
			)}
			{icon && <Icon icon={icon} className="ml-2" width={24} />}
		</div>
	);
};
