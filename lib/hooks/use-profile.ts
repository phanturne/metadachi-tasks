import type { Tables } from "@/supabase/types";
import useSWR, { mutate } from "swr";
import { fetcher } from "../fetcher";

export function useProfile(userId?: string) {
	const { data, error } = useSWR<Tables<"profiles"> | null>(
		userId ? `/api/profile/${userId}` : null,
		fetcher,
	);

	return {
		profile: data as Tables<"profiles">,
		loading: !error && !data,
		error,
	};
}

// Function to mark the data as stale
export function markProfileAsStale(userId: string) {
	mutate(`/api/profile/${userId}`);
}
