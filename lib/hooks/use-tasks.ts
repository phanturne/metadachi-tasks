import { type TaskWithInstances, getTasksWithInstances } from "@/lib/db/tasks";
import { useEffect, useState } from "react";

export function useTasksWithInstances(userId: string) {
	const [tasks, setTasks] = useState<TaskWithInstances[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchTasks() {
			try {
				const tasksData = await getTasksWithInstances(userId);
				setTasks(tasksData);
				setLoading(false);
			} catch (error) {
				setError("Failed to fetch tasks");
				setLoading(false);
			}
		}

		fetchTasks();
	}, [userId]);

	return { tasks, loading, error };
}
