import { supabase } from "@/lib/supabase/browser-client";

export const getUserStats = async (
	userId: string,
	startDate: string,
	endDate: string,
) => {
	if (!userId) {
		return null;
	}

	const { data, error } = await supabase.rpc("get_user_stats", {
		p_user_id: userId,
		p_start_date: startDate,
		p_end_date: endDate,
	});

	if (error) throw new Error(error.message);
	return data;
};
