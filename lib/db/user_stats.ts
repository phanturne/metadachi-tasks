"use server";

import { createClient } from "@/lib/supabase/server";

// Fetch user stats within a date range
export const getUserStats = async (
	userId: string,
	startDate: string,
	endDate: string,
) => {
	if (!userId) {
		return null;
	}

	const supabase = createClient();

	const { data, error } = await supabase.rpc("get_user_stats", {
		p_user_id: userId,
		p_start_date: startDate,
		p_end_date: endDate,
	});

	if (error) throw new Error(error.message);
	return data;
};
