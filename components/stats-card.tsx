"use client";

import { GoldStatsChart } from "@/components/stats-chart";
import { useSession } from "@/lib/hooks/use-session";
import { useStats } from "@/lib/hooks/use-stats";
import { Icon } from "@iconify/react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import React from "react";

export default function StatsCard() {
	const { session } = useSession();
	const userId = session?.user.id || "";
	const { stats, isLoading, isError, dates } = useStats(userId);

	// TODO: Add proper skeletons
	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error loading stats</div>;

	const todaysStats = stats[0];

	const goldChange = todaysStats
		? (todaysStats?.gold_earned ?? 0) - (todaysStats?.gold_spent ?? 0)
		: undefined;

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
					value={todaysStats?.tasks_completed ?? 0}
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
