"use client";

import {
	AuthFormType,
	useAuthModal,
} from "@/components/providers/auth-context-provider";
import { GoldStatsChart } from "@/components/stats-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/hooks/use-session";
import { useStats } from "@/lib/hooks/use-stats";
import { Icon } from "@iconify/react";
import type React from "react";

export default function StatsCard() {
	const { session } = useSession();
	const userId = session?.user.id || "";
	const { stats, isLoading, isError, dates } = useStats(userId);
	const { openAuthModal } = useAuthModal();

	if (isLoading) {
		return (
			<Card className="w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
				<CardHeader>
					<CardTitle>Stats</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<Skeleton className="h-4 w-[250px]" />
					<Skeleton className="h-4 w-[200px]" />
					<Skeleton className="h-4 w-[150px]" />
					<Skeleton className="h-[200px] w-full" />
				</CardContent>
			</Card>
		);
	}

	if (!session) {
		return (
			<Card className="w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
				<CardHeader>
					<CardTitle>Stats</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col items-center justify-center space-y-4">
					<Icon icon="mdi:lock" className="h-12 w-12" />
					<p className="text-center">Log in to view stats</p>
					<div className="flex space-x-2">
						<Button
							variant="outline"
							onClick={() => openAuthModal(AuthFormType.Login)}
						>
							Login
						</Button>
						<Button
							variant="outline"
							onClick={() => openAuthModal(AuthFormType.SignUp)}
						>
							Sign Up
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (isError) {
		return (
			<Card className="w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
				<CardHeader>
					<CardTitle>Stats</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-destructive">Error loading stats...</p>
				</CardContent>
			</Card>
		);
	}

	const todaysStats = stats[0];
	const goldChange = todaysStats
		? (todaysStats?.gold_earned ?? 0) - (todaysStats?.gold_spent ?? 0)
		: undefined;

	return (
		<Card className="w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
			<CardHeader>
				<CardTitle>Stats</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
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
			</CardContent>
		</Card>
	);
}

interface StatCardItemProps {
	label: string;
	value: number;
	change?: number;
	icon?: string;
}

const StatCardItem: React.FC<StatCardItemProps> = ({
	label,
	value,
	change,
	icon,
}) => {
	const changeColor =
		change !== undefined && change >= 0 ? "text-success" : "text-destructive";
	const changeIcon =
		change !== undefined && change >= 0
			? "solar:alt-arrow-up-bold"
			: "solar:alt-arrow-down-bold";

	return (
		<div className="flex items-center space-x-2">
			<span className="font-semibold">{label}:</span>
			<span>{value}</span>
			{change !== undefined && (
				<div className={`flex items-center ${changeColor}`}>
					<Icon icon={changeIcon} className="h-4 w-4" />
					<span className="ml-1">{Math.abs(change)}</span>
				</div>
			)}
			{icon && <Icon icon={icon} className="h-5 w-5" />}
		</div>
	);
};
