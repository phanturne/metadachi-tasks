import { useAuthModal } from "@/components/providers/auth-context-provider";
import { Routes } from "@/lib/constants";
import { supabase } from "@/lib/supabase/browser-client";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function GuestLoginButton() {
	const router = useRouter();
	const { closeAuthModal } = useAuthModal();

	async function handleGuestLogin() {
		const { error } = await supabase.auth.signInAnonymously();

		if (error) {
			console.error("Error creating a guest account:", error);
		} else {
			closeAuthModal();
			toast.success(
				"You're in as a guest! Sign up anytime to save your progress.",
			);
			router.push(Routes.Setup);
		}
	}

	return (
		<Button variant="ghost" onClick={handleGuestLogin}>
			Continue as Guest
		</Button>
	);
}
