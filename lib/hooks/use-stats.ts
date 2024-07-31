import { delay } from "@/lib/utils";
import type { Tables } from "@/supabase/types";
import { useState } from "react";
import useSWR, { mutate } from "swr";

type UserStat = Tables<"user_stats">;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Helper function to get default dates
const getDefaultDates = () => {
	const end = new Date();
	const start = new Date(end);
	start.setDate(start.getDate() - 6);

	return {
		startDate: start.toISOString().split("T")[0],
		endDate: end.toISOString().split("T")[0],
	};
};

export function useStats(userId: string) {
	const [dates] = useState(getDefaultDates);

	const url =
		userId && dates.startDate && dates.endDate
			? `/api/stats/${userId}?startDate=${dates.startDate}&endDate=${dates.endDate}`
			: null;

	const { data, error, mutate } = useSWR<UserStat[]>(url, fetcher);

	return {
		stats: data ?? [],
		isLoading: !error && !data,
		isError: error,
		dates,
		mutate,
		url,
	};
}

// Function to mark the data as stale
export function markStatsAsStale(userId: string) {
	const { startDate, endDate } = getDefaultDates();
	const url = `/api/stats/${userId}?startDate=${startDate}&endDate=${endDate}`;
	delay(1500); // TODO: Hacky delay for the data to be updated. Use optimistic UI w/ context provider instead?
	mutate(url);
}

export function calculateTasksCompletedToday(
	todaysStats?: UserStat,
	yesterdayStats?: UserStat,
): number {
	if (!todaysStats) return 0;
	if (!yesterdayStats) return todaysStats.tasks_completed ?? 0;
	return (
		(todaysStats.tasks_completed ?? 0) - (yesterdayStats.tasks_completed ?? 0)
	);
}
