import { ALLOW_ANONYMOUS_USERS } from "@/lib/config";
import { supabase } from "@/lib/supabase/browser-client";
import type { Session } from "@supabase/auth-js";
import { useEffect, useState } from "react";

export const useSession = () => {
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null); // Initialize error state

	useEffect(() => {
		const fetchSession = async () => {
			try {
				const sessionData = await supabase.auth.getSession();
				const session = sessionData?.data?.session || null;
				setSession(session);
			} catch (e) {
				setError(e as Error); // Handle errors in session fetching
			} finally {
				setLoading(false); // Ensure loading is set to false here
			}
		};

		fetchSession();
	}, []);

	const createAnonymousUser = async () => {
		if (!session && ALLOW_ANONYMOUS_USERS) {
			try {
				const { data, error } = await supabase.auth.signInAnonymously();
				if (error) {
					console.error("Error creating a guest account:", error);
				}
				setSession(data.session); // Update session state
			} catch (e) {
				setError(e as Error); // Set error on failure
			} finally {
				setLoading(false); // Ensure loading is set to false here
			}
		}
	};

	return {
		session,
		setSession,
		loading,
		error,
		isAnonymous: session?.user?.is_anonymous ?? false,
		createAnonymousUser,
	};
};
