import { supabase } from "@/lib/supabase/browser-client";
import type { Tables, TablesInsert, TablesUpdate } from "@/supabase/types";

export type TaskWithInstances = Tables<"tasks"> & {
	instances: Tables<"task_instances">[];
};

// Fetch all tasks for the current user
export const getUserTasks = async () => {
	const { data, error } = await supabase
		.from("tasks")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) throw new Error(error.message);
	return data;
};

// Fetch a specific task by ID
export const getTaskById = async (taskId: string) => {
	const { data, error } = await supabase
		.from("tasks")
		.select("*")
		.eq("id", taskId)
		.single();

	if (error) throw new Error(error.message);
	return data;
};

// Create a new task
export const createTask = async (taskData: TablesInsert<"tasks">) => {
	const { data, error } = await supabase
		.from("tasks")
		.insert(taskData)
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
};

// Update an existing task
export const updateTask = async (
	taskId: string,
	updates: TablesUpdate<"tasks">,
) => {
	const { data, error } = await supabase
		.from("tasks")
		.update(updates)
		.eq("id", taskId)
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
};

// Delete a task
export const deleteTask = async (taskId: string) => {
	const { error } = await supabase.from("tasks").delete().eq("id", taskId);

	if (error) throw new Error(error.message);
};

// Fetch task instances for a specific task
export const getTaskInstances = async (taskId: string) => {
	const { data, error } = await supabase
		.from("task_instances")
		.select("*")
		.eq("task_id", taskId)
		.order("start_time", { ascending: true });

	if (error) throw new Error(error.message);
	return data;
};

// Update a task instance
export const updateTaskInstance = async (
	instanceId: string,
	updates: TablesUpdate<"task_instances">,
) => {
	const { data, error } = await supabase
		.from("task_instances")
		.update(updates)
		.eq("id", instanceId)
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
};

export const getTasksWithInstances = async (
	userId: string,
): Promise<TaskWithInstances[]> => {
	const { data, error } = await supabase
		.from("tasks")
		.select(`
      *,
      instances:task_instances(*)
    `)
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (error) throw new Error(error.message);
	return data as TaskWithInstances[];
};
