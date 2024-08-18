// Source: https://nextui.pro/components/ecommerce/product-list#component-place-list-grid

"use client";

import { RewardModal } from "@/components/rewards/reward-item-modal";
import {
	claimUserReward,
	deleteUserReward,
	updateUserReward,
} from "@/lib/db/rewards";
import { markUserRewardsAsStale } from "@/lib/hooks/use-rewards";
import { useSession } from "@/lib/hooks/use-session";
import { markStatsAsStale, useStats } from "@/lib/hooks/use-stats";
import type { Tables } from "@/supabase/types";
import { Icon } from "@iconify/react";
import {
	Button,
	Card,
	Image,
	Skeleton,
	useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { toast } from "sonner";

export const RewardItem = React.forwardRef<
	HTMLDivElement,
	Tables<"user_rewards">
>((reward, ref) => {
	const { session } = useSession();
	const { stats } = useStats(session?.user?.id ?? "");

	const { isOpen, onOpen, onClose } = useDisclosure();

	const onDelete = async () => {
		try {
			await deleteUserReward(reward.id);
			markUserRewardsAsStale(reward.user_id);
			toast.success("Reward deleted successfully");
		} catch (error) {
			toast.error("Failed to delete reward");
		}
	};

	const onSave = async (reward: Tables<"user_rewards">) => {
		try {
			await updateUserReward(reward.id, reward);
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
			<Card ref={ref} className="relative flex w-full flex-none flex-col gap-3">
				<Button
					isIconOnly
					className="absolute top-2 right-2 z-20 bg-background/60 backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50"
					radius="full"
					size="sm"
					variant="flat"
					onClick={() => onOpen()}
				>
					<Icon icon="solar:pen-bold-duotone" width={16} />
				</Button>

				{reward.image ? (
					<Image
						isBlurred
						isZoomed
						alt={reward.name}
						className="aspect-square w-full hover:scale-110"
						src={reward.image}
					/>
				) : (
					<div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-gray-200">
						<Icon
							icon={reward.icon ?? "solar:gift-bold-duotone"}
							width={48}
							className="text-gray-500 hover:scale-110"
						/>
					</div>
				)}

				<div className="mt-1 flex flex-col gap-2 px-1">
					<div className="flex items-start justify-between gap-1">
						<h3 className="truncate font-medium text-default-700 text-small">
							{reward.name}
						</h3>
					</div>
					{/*{description ? (*/}
					{/*	<p className="text-small text-default-500">{description}</p>*/}
					{/*) : null}*/}
					<Button size="sm" onClick={purchaseReward}>
						{reward.cost} 🪙
					</Button>
				</div>
				<RewardModal
					isOpen={isOpen}
					onClose={onClose}
					reward={reward}
					onDelete={onDelete}
					onSave={onSave}
				/>
			</Card>
		</>
	);
});

RewardItem.displayName = "RewardListItem";

export const RewardItemSkeleton = () => {
	return (
		<Card className="relative flex w-full flex-none flex-col gap-3">
			<Skeleton className="absolute top-2 right-2 z-20 rounded-full bg-default-100">
				<div className="h-6 w-6 rounded-full" />
			</Skeleton>

			<Skeleton className="aspect-square w-full rounded-2xl">
				<div className="h-full w-full bg-default-200" />
			</Skeleton>

			<div className="mt-1 flex flex-col gap-2 px-1">
				<Skeleton className="w-full rounded-lg">
					<div className="h-4 w-full rounded-lg bg-default-200" />
				</Skeleton>

				<Skeleton className="mt-2 w-full rounded-lg">
					<div className="h-8 w-full rounded-lg bg-default-300" />
				</Skeleton>
			</div>
		</Card>
	);
};
