"use client";

import {
	AuthFormType,
	useAuthModal,
} from "@/components/providers/auth-context-provider";
import { GoldStatsChart } from "@/components/stats-chart";
import { useSession } from "@/lib/hooks/use-session";
import { useStats } from "@/lib/hooks/use-stats";
import { Icon } from "@iconify/react";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Skeleton,
} from "@nextui-org/react";
import React from "react";

export default function StatsCard() {
	const { session } = useSession();
	const userId = session?.user.id || "";
	const { stats, isLoading, isError, dates } = useStats(userId);
	const { openAuthModal } = useAuthModal();

	// TODO: Add proper skeletons
	if (isLoading) {
		return (
			<Card className="px-4 rounded-lg w-full flex flex-col overflow-y-scroll">
				<CardHeader className="flex justify-between">
					<h1 className="text-xl bold">Stats</h1>
				</CardHeader>
				<CardBody className="overflow-visible gap-2">
					<Skeleton className="h-5 rounded-lg" />
					<Skeleton className="h-5 rounded-lg" />
					<Skeleton className="h-5 rounded-lg" />
					<Skeleton className="h-32 rounded-lg" />
				</CardBody>
			</Card>
		);
	}

	if (!session) {
		return (
			<Card className="px-4 rounded-lg w-full flex flex-col overflow-y-scroll">
				<CardHeader className="flex justify-between">
					<h1 className="text-xl bold">Stats</h1>
				</CardHeader>
				<CardBody className="overflow-visible flex flex-col items-center justify-center">
					<Icon icon="mdi:lock" className="text-4xl mb-4" />
					<p>Log in to view stats</p>
					<div className="flex gap-2 mt-4">
						<Button
							variant="ghost"
							onClick={() => openAuthModal(AuthFormType.Login)}
						>
							Login
						</Button>
						<Button
							variant="ghost"
							onClick={() => openAuthModal(AuthFormType.SignUp)}
						>
							Sign Up
						</Button>
					</div>
				</CardBody>
			</Card>
		);
	}

	if (isError) {
		return (
			<Card className="px-4 rounded-lg w-full flex flex-col overflow-y-scroll">
				<CardHeader className="flex justify-between">
					<h1 className="text-xl bold">Stats</h1>
				</CardHeader>
				<CardBody className="overflow-visible gap-2">
					<p>Error loading stats...</p>
				</CardBody>
			</Card>
		);
	}

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
