import { supabase } from "@/lib/supabase/browser-client";

export const getUserActivities = async (
	userId: string,
	startDate: string,
	endDate: string,
) => {
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

export const summarizeDailyActivities = async (
	userId: string,
	date: string,
) => {
	const { data, error } = await supabase.rpc("summarize_daily_activities", {
		p_user_id: userId,
		p_date: date,
	});

	if (error) throw new Error(error.message);
	return data;
};
