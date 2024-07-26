import { supabase } from "@/lib/supabase/browser-client";

// Create a new quest
// TODO: implement
export const createQuest = async (questName: string) => {
	const { data, error } = await supabase
		.from("quests")
		.insert({ quest_name: questName })
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
};
