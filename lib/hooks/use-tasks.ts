import type { TaskWithInstances } from "@/lib/db/tasks";
import useSWR, { mutate } from "swr";

// Define the fetcher function
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTasksWithInstances(userId: string) {
	const { data, error, mutate } = useSWR<TaskWithInstances[] | undefined>(
		userId ? `/api/tasks/${userId}` : null,
		fetcher,
	);

	// Returning data and error, and handling cases where data might be undefined
	return {
		tasks: data ?? [],
		loading: !error && !data,
		error,
		mutate,
	};
}

// Function to mark the data as stale
export function markTasksAsStale(userId: string) {
	mutate(`/api/tasks/${userId}`);
}
