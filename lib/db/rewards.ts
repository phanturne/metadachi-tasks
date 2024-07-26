import { supabase } from "@/lib/supabase/browser-client";

// Create a new reward
// TODO: implement
export const createReward = async (rewardName: string) => {
	const { data, error } = await supabase
		.from("rewards")
		.insert({ reward_name: rewardName })
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
};

// Delete a reward
// TODO: implement
export const deleteReward = async (rewardId: number) => {
	const { error } = await supabase.from("rewards").delete().eq("id", rewardId);

	if (error) throw new Error(error.message);
};
