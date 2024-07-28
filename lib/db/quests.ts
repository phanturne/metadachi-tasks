import { supabase } from "@/lib/supabase/browser-client";
import type { Database } from "@/supabase/types";

export const createQuest = async (
	questData: Database["public"]["Functions"]["create_quest"]["Args"],
) => {
	const { data, error } = await supabase.rpc("create_quest", questData);

	if (error) throw new Error(error.message);
	return data;
};

export const updateQuestProgress = async (
	questId: string,
	progressIncrement: number,
) => {
	const { data, error } = await supabase.rpc("update_quest_progress", {
		p_quest_id: questId,
		p_progress_increment: progressIncrement,
	});

	if (error) throw new Error(error.message);
	return data;
};

export const getActiveQuests = async (userId: string) => {
	const { data, error } = await supabase.rpc("get_active_quests", {
		p_user_id: userId,
	});

	if (error) throw new Error(error.message);
	return data;
};