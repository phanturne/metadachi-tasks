import { useAuthModal } from "@/components/providers/auth-context-provider";
import { Button } from "@/components/ui/button"; // Import Shadcn button
import { supabase } from "@/lib/supabase/browser-client";
import { Icon } from "@iconify/react";
import type { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import React from "react";

export default function OAuthButtons() {
	const { closeAuthModal } = useAuthModal();

	async function handleOauthLogin(provider: Provider) {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {},
		});

		closeAuthModal();

		if (data.url) {
			redirect(data.url); // use the redirect API for your server framework
		}
	}

	return (
		<div className="flex grow gap-2">
			<Button
				variant="outline"
				className="flex grow items-center justify-center gap-2"
				onClick={() => handleOauthLogin("discord")}
			>
				<Icon className="text-xl" icon="logos:discord-icon" />
				Discord
			</Button>
			<Button
				variant="outline"
				className="flex grow items-center justify-center gap-2"
				onClick={() => handleOauthLogin("github")}
			>
				<Icon className="text-xl dark:invert" icon="logos:github-icon" />
				GitHub
			</Button>
		</div>
	);
}
