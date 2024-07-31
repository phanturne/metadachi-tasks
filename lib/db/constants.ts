import type { Tables } from "@/supabase/types";
import { z } from "zod";

export enum TaskDifficulty {
	VeryEasy = "Very Easy",
	Easy = "Easy",
	Medium = "Medium",
	Hard = "Hard",
	VeryHard = "Very Hard",
}

// Create a Zod schema for the enum with a default value
export const TaskDifficultySchema = z
	.nativeEnum(TaskDifficulty)
	.default(TaskDifficulty.Easy);

export type TaskWithInstances = Tables<"tasks"> & {
	instances: Tables<"task_instances">[];
};

export const difficultyGoldMap: Record<TaskDifficulty, number> = {
	[TaskDifficulty.VeryEasy]: 5,
	[TaskDifficulty.Easy]: 10,
	[TaskDifficulty.Medium]: 25,
	[TaskDifficulty.Hard]: 50,
	[TaskDifficulty.VeryHard]: 100,
};
