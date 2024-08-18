import type { Tables } from "@/supabase/types";
import useSWR, { mutate } from "swr";
import { fetcher } from "../fetcher";

export function useUserRewards(userId?: string) {
	const { data, error } = useSWR<Tables<"user_rewards">[] | undefined>(
		userId ? `/api/user-rewards/${userId}` : null,
		fetcher,
	);

	return {
		rewards: data ?? ([] as Tables<"user_rewards">[]),
		loading: !error && !data && userId !== "",
		error,
	};
}

// Function to mark the data as stale
export function markUserRewardsAsStale(userId: string) {
	mutate(`/api/user-rewards/${userId}`);
}
