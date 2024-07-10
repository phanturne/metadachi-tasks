import { supabase } from "@/lib/supabase/browser-client";
import { toast } from "sonner";

export const useSignOut = () => {
	const handleSignOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			toast.error(error.message);
		} else {
			toast.success("Signed out successfully");
			window.location.reload();
		}
	};

	return { handleSignOut };
};
