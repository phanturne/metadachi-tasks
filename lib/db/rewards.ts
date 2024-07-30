"use server";

import { createClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "@/supabase/types";

// Fetch user rewards
export const getUserRewards = async (userId: string) => {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("user_rewards")
		.select("*")
		.eq("user_id", userId)
		.eq("is_active", true)
		.order("created_at", { ascending: false });

	if (error) throw new Error(error.message);
	return data;
};

// Create a user reward
export const createUserReward = async (
	rewardData: TablesInsert<"user_rewards">,
) => {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("user_rewards")
		.insert(rewardData)
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
};

// Update a user reward
export const updateUserReward = async (
	rewardId: string,
	updates: TablesUpdate<"user_rewards">,
) => {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("user_rewards")
		.update(updates)
		.eq("id", rewardId)
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
};

// Claim a user reward
export const claimUserReward = async (userId: string, rewardId: string) => {
	const supabase = createClient();

	const { data, error } = await supabase.rpc("claim_user_reward", {
		p_user_id: userId,
		p_reward_id: rewardId,
	});

	if (error) throw new Error(error.message);
	return data;
};

// Reset user rewards
export const resetUserRewards = async () => {
	const supabase = createClient();

	const { data, error } = await supabase.rpc("reset_user_rewards");

	if (error) throw new Error(error.message);
	return data;
};
