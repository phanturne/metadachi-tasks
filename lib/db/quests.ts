"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/supabase/types";

// Create a quest
export const createQuest = async (
	questData: Database["public"]["Functions"]["create_quest"]["Args"],
) => {
	const supabase = createClient();

	const { data, error } = await supabase.rpc("create_quest", questData);

	if (error) throw new Error(error.message);
	return data;
};

// Update quest progress
export const updateQuestProgress = async (
	questId: string,
	progressIncrement: number,
) => {
	const supabase = createClient();

	const { data, error } = await supabase.rpc("update_quest_progress", {
		p_quest_id: questId,
		p_progress_increment: progressIncrement,
	});

	if (error) throw new Error(error.message);
	return data;
};

// Get active quests for a user
export const getActiveQuests = async (userId: string) => {
	const supabase = createClient();

	const { data, error } = await supabase.rpc("get_active_quests", {
		p_user_id: userId,
	});

	if (error) throw new Error(error.message);
	return data;
};
