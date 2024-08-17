import {
	RewardItem,
	RewardItemSkeleton,
} from "@/components/rewards/reward-item";
import type { Tables } from "@/supabase/types";
import { Icon } from "@iconify/react";

export const RewardsList = ({
	rewards,
	loading,
}: { rewards: Tables<"user_rewards">[]; loading: boolean }) => {
	if (loading) {
		return (
			<div className="grid max-w-7xl grid-cols-1 gap-5 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{Array.from({ length: 10 }).map((_, index) => (
					<RewardItemSkeleton key={index} />
				))}
			</div>
		);
	}

	if (!rewards || rewards.length === 0) {
		return <EmptyRewardsList />;
	}

	return (
		<div className="grid max-w-7xl grid-cols-1 gap-5 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{rewards.map((reward) => (
				<RewardItem key={reward.id} {...reward} />
			))}
		</div>
	);
};

export function EmptyRewardsList() {
	return (
		<div className="flex h-full w-full flex-col items-center justify-center space-y-4 text-center">
			<Icon
				icon="solar:medal-ribbons-star-bold"
				className="size-28 text-yellow-500"
			/>
			<p className="text-lg">
				No rewards yet. Start by adding something to redeem!
			</p>
		</div>
	);
}
