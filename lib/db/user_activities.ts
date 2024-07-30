"use server";

import { createClient } from "@/lib/supabase/server";

// Fetch user activities within a date range
export const getUserActivities = async (
	userId: string,
	startDate: string,
	endDate: string,
) => {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("user_activities")
		.select("*")
		.eq("user_id", userId)
		.gte("created_at", startDate)
		.lte("created_at", endDate)
		.order("created_at", { ascending: false });

	if (error) throw new Error(error.message);
	return data;
};

// Summarize daily activities for a user
export const summarizeDailyActivities = async (
	userId: string,
	date: string,
) => {
	const supabase = createClient();

	const { data, error } = await supabase.rpc("summarize_daily_activities", {
		p_user_id: userId,
		p_date: date,
	});

	if (error) throw new Error(error.message);
	return data;
};
