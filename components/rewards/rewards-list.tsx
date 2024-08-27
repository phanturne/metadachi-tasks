import {
	RewardItem,
	RewardItemSkeleton,
} from "@/components/rewards/reward-item";
import type { Tables } from "@/supabase/types";
import { Medal } from "lucide-react";

export const RewardsList = ({
	rewards,
	loading,
}: {
	rewards: Tables<"user_rewards">[];
	loading: boolean;
}) => {
	if (loading) {
		return (
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{Array.from({ length: 8 }).map((_, index) => (
					<RewardItemSkeleton key={index} />
				))}
			</div>
		);
	}

	if (!rewards || rewards.length === 0) {
		return <EmptyRewardsList />;
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{rewards.map((reward) => (
				<RewardItem key={reward.id} {...reward} />
			))}
		</div>
	);
};

export function EmptyRewardsList() {
	return (
		<div className="flex h-[200px] w-full flex-col items-center justify-center space-y-4 text-center">
			<Medal className="h-16 w-16 text-yellow-500" />
			<p className="text-lg text-muted-foreground">
				No rewards yet. Start by adding something to redeem!
			</p>
		</div>
	);
}
