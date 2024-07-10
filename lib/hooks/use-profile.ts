import { getProfileByUserId } from "@/lib/db/profile";
import type { Tables } from "@/supabase/types";
import { useEffect, useState } from "react";

export function useProfile(userId?: string) {
	const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!userId) {
			setLoading(false);
			setProfile(null);
			setError("User ID is required");
			return;
		}

		const fetchProfile = async () => {
			try {
				const fetchedProfile = await getProfileByUserId(userId);
				setProfile(fetchedProfile);
				setLoading(false);
			} catch (err) {
				setError(err instanceof Error ? err.message : String(err));
				setLoading(false);
			}
		};

		fetchProfile();
	}, [userId]);

	return { profile, loading, error };
}
