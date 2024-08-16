"use server";

import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert, TablesUpdate } from "@/supabase/types";

export type TaskWithInstances = Tables<"tasks"> & {
	instances: Tables<"task_instances">[];
};

// Fetch all tasks for the current user
export const getUserTasks = async () => {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("tasks")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) throw new Error(error.message);
	return data;
};

// Fetch a specific task by ID
export const getTaskById = async (taskId: string) => {
	const supabase = createClient();

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
	const supabase = createClient();

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
	const supabase = createClient();

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
	const supabase = createClient();

	const { error } = await supabase.from("tasks").delete().eq("id", taskId);

	if (error) throw new Error(error.message);
};

// Skip a task
export const skipTask = async (taskId: number) => {
	// TODO: implement
};

// Fetch task instances for a specific task
export const getTaskInstances = async (taskId: string) => {
	const supabase = createClient();

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
	const supabase = createClient();

	const { data, error } = await supabase
		.from("task_instances")
		.update(updates)
		.eq("id", instanceId)
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
};

// Function to delete a task instance by its ID
export const deleteTaskInstance = async (instanceId: string) => {
	const supabase = createClient();

	const { error } = await supabase
		.from("task_instances")
		.delete()
		.eq("id", instanceId);

	if (error) throw new Error(error.message);
};

export const getTasksWithInstances = async (
	userId: string,
): Promise<TaskWithInstances[]> => {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("tasks")
		.select(`
      *,
      instances:task_instances(*)
    `)
		.eq("user_id", userId)
		.order("end_time", { ascending: false })
		.order("created_at", { ascending: false });

	if (error) throw new Error(error.message);
	return data as TaskWithInstances[];
};
