// Adapted from https://github.com/mckaywrigley/chatbot-ui/tree/main/db

import { supabase } from "@/lib/supabase/browser-client";
import type { TablesUpdate } from "@/supabase/types";

export const getProfileByUserId = async (userId: string) => {
	const { data: profile, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("user_id", userId)
		.single();

	if (!profile) {
		throw new Error(error.message);
	}

	return profile;
};

export const updateProfile = async (
	profileId: string,
	profile: TablesUpdate<"profiles">,
) => {
	const { data: updatedProfile, error } = await supabase
		.from("profiles")
		.update(profile)
		.eq("id", profileId)
		.select("*")
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return updatedProfile;
};

export const deleteProfile = async (profileId: string) => {
	const { error } = await supabase
		.from("profiles")
		.delete()
		.eq("id", profileId);

	if (error) {
		throw new Error(error.message);
	}

	return true;
};
