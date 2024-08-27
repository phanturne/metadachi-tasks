"use client";

import { RewardModal } from "@/components/rewards/reward-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
	claimUserReward,
	deleteUserReward,
	updateUserReward,
} from "@/lib/db/rewards";
import { markUserRewardsAsStale } from "@/lib/hooks/use-rewards";
import { useSession } from "@/lib/hooks/use-session";
import { markStatsAsStale, useStats } from "@/lib/hooks/use-stats";
import type { Tables } from "@/supabase/types";
import { Coins, Edit, Gift, MoreVertical, Trash } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

export const RewardItem = React.forwardRef<
	HTMLDivElement,
	Tables<"user_rewards">
>((reward, ref) => {
	const { session } = useSession();
	const { stats } = useStats(session?.user?.id ?? "");
	const [isOpen, setIsOpen] = useState(false);

	const onDelete = async () => {
		try {
			await deleteUserReward(reward.id);
			markUserRewardsAsStale(reward.user_id);
			toast.success("Reward deleted successfully");
		} catch (error) {
			toast.error("Failed to delete reward");
		}
	};

	const onSave = async (updatedReward: Tables<"user_rewards">) => {
		try {
			await updateUserReward(updatedReward.id, updatedReward);
			markUserRewardsAsStale(session?.user?.id ?? "");
			toast.success("Reward updated successfully");
		} catch (e) {
			toast.error("Failed to update reward");
		}
	};

	const purchaseReward = async () => {
		const firstStat = stats?.[0] ?? null;
		if (!session || !firstStat) return;

		if (reward.cost > (firstStat.total_gold ?? 0)) {
			return toast.error("Insufficient balance");
		}

		try {
			await claimUserReward(session.user.id, reward.id);
			markUserRewardsAsStale(session.user.id);
			markStatsAsStale(session.user.id);
			toast.success("Reward purchased successfully");
		} catch (error) {
			toast.error("Failed to purchase reward");
		}
	};

	return (
		<>
			<Card
				ref={ref}
				className="group relative flex h-full w-full flex-col overflow-hidden transition-all duration-300 hover:shadow-xl"
			>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							size="icon"
							variant="ghost"
							className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-black/20 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
						>
							<MoreVertical className="h-4 w-4 text-white" />
							<span className="sr-only">Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => setIsOpen(true)}>
							<Edit className="mr-2 h-4 w-4" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem onClick={onDelete}>
							<Trash className="mr-2 h-4 w-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<CardContent className="flex-grow p-0">
					<div className="relative aspect-square w-full overflow-hidden">
						{reward.image ? (
							<Image
								src={reward.image}
								alt={reward.name}
								layout="fill"
								objectFit="cover"
								className="transition-transform duration-300 group-hover:scale-110"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500 to-fuchsia-500">
								<Gift className="h-16 w-16 text-white" />
							</div>
						)}
						<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
							<h3 className="line-clamp-2 font-bold text-lg text-white">
								{reward.name}
							</h3>
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex items-center justify-between gap-2 bg-gray-50 p-4 dark:bg-gray-800">
					<div className="flex items-center gap-1">
						<Coins className="h-5 w-5 text-yellow-500" />
						<span className="font-semibold text-lg">{reward.cost}</span>
					</div>
					<Button
						onClick={purchaseReward}
						className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white transition-all duration-300 hover:from-violet-600 hover:to-fuchsia-600 hover:shadow-lg"
					>
						Claim
					</Button>
				</CardFooter>
			</Card>
			<RewardModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				reward={reward}
				onDelete={onDelete}
				onSave={onSave}
			/>
		</>
	);
});

RewardItem.displayName = "RewardItem";

export const RewardItemSkeleton = () => {
	return (
		<Card className="relative flex h-full w-full flex-col overflow-hidden">
			<CardContent className="flex-grow p-0">
				<Skeleton className="aspect-square w-full" />
			</CardContent>
			<CardFooter className="flex items-center justify-between gap-2 bg-gray-50 p-4 dark:bg-gray-800">
				<Skeleton className="h-6 w-16" />
				<Skeleton className="h-10 w-24" />
			</CardFooter>
		</Card>
	);
};
