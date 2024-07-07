import { supabase } from "@/lib/supabase/browser-client";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";
import type { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import React from "react";

export default function OAuthButtons() {
	async function handleOauthLogin(provider: Provider) {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {},
		});

		if (data.url) {
			redirect(data.url); // use the redirect API for your server framework
		}
	}

	return (
		<div className="flex grow gap-2">
			{/*<Button*/}
			{/*  isIconOnly*/}
			{/*  variant="bordered"*/}
			{/*  onClick={() => handleOauthLogin("google")}*/}
			{/*  className="grow"*/}
			{/*>*/}
			{/*  <Icon icon="logos:google-icon" className="text-xl" />*/}
			{/*</Button>*/}
			{/*<Button*/}
			{/*  isIconOnly*/}
			{/*  variant="bordered"*/}
			{/*  className="grow"*/}
			{/*  onClick={() => handleOauthLogin("apple")}*/}
			{/*>*/}
			{/*  <Icon className="text-xl dark:invert" icon="logos:apple" />*/}
			{/*</Button>*/}
			{/*<Button*/}
			{/*  isIconOnly*/}
			{/*  variant="bordered"*/}
			{/*  className="grow"*/}
			{/*  onClick={() => handleOauthLogin("discord")}*/}
			{/*>*/}
			{/*  <Icon className="text-xl" icon="logos:discord-icon" />*/}
			{/*</Button>*/}
			{/*<Button*/}
			{/*  isIconOnly*/}
			{/*  variant="bordered"*/}
			{/*  className="grow"*/}
			{/*  onClick={() => handleOauthLogin("github")}*/}
			{/*>*/}
			{/*  <Icon className="text-xl dark:invert" icon="logos:github-icon" />*/}
			{/*</Button>*/}
			<Button
				variant="bordered"
				className="grow"
				onClick={() => handleOauthLogin("discord")}
				startContent={<Icon className="text-xl" icon="logos:discord-icon" />}
			>
				Discord
			</Button>
			<Button
				variant="bordered"
				className="grow"
				onClick={() => handleOauthLogin("github")}
				startContent={
					<Icon className="text-xl dark:invert" icon="logos:github-icon" />
				}
			>
				GitHub
			</Button>
		</div>
	);
}
