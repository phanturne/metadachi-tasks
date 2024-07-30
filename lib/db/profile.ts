"use server";

import { createClient } from "@/lib/supabase/server";
import type { TablesUpdate } from "@/supabase/types";

// Fetch a profile by user ID
export const getProfileByUserId = async (userId: string) => {
	const supabase = createClient();

	const { data: profile, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("user_id", userId)
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return profile;
};

// Update a profile
export const updateProfile = async (
	profileId: string,
	profile: TablesUpdate<"profiles">,
) => {
	const supabase = createClient();

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

// Delete a profile
export const deleteProfile = async (profileId: string) => {
	const supabase = createClient();

	const { error } = await supabase
		.from("profiles")
		.delete()
		.eq("id", profileId);

	if (error) {
		throw new Error(error.message);
	}

	return true;
};
