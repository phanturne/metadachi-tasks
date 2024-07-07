// Source: https://github.com/mckaywrigley/chatbot-ui/blob/d60e1f3ee9d2caf8c9aab659791b841690183b2d/%5Blocale%5D/login/page.tsx#L145

import OAuthButtons from "@/components/auth/OAuthButtons";
import { EmailInput, PasswordInput } from "@/components/input";
import {
	AuthFormType,
	useAuthModal,
} from "@/components/providers/auth-context-provider";
import { EMAIL_VERIFICATION, ROOT_URL } from "@/lib/config";
import { Routes } from "@/lib/constants";
import { supabase } from "@/lib/supabase/browser-client";
import { Button, Divider, Link } from "@nextui-org/react";
import { get } from "@vercel/edge-config";
import { useRouter } from "next/navigation";
import type React from "react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

export function SignUpForm({
	setAuthFormType,
}: {
	setAuthFormType: React.Dispatch<React.SetStateAction<AuthFormType>>;
}) {
	const [error, setError] = useState<string>("");
	const isInvalid = error !== "";
	const { closeAuthModal } = useAuthModal();
	const router = useRouter();

	const getEnvVarOrEdgeConfigValue = async (name: string) => {
		// "use server"
		if (process.env.EDGE_CONFIG) {
			return await get<string>(name);
		}

		return process.env[name];
	};

	async function handleSignup(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const formJson = Object.fromEntries(formData.entries());

		const email = formJson["email"] as string;
		const password = formJson["password"] as string;

		const emailDomainWhitelistPatternsString = await getEnvVarOrEdgeConfigValue(
			"EMAIL_DOMAIN_WHITELIST",
		);
		const emailDomainWhitelist = emailDomainWhitelistPatternsString?.trim()
			? emailDomainWhitelistPatternsString?.split(",")
			: [];
		const emailWhitelistPatternsString =
			await getEnvVarOrEdgeConfigValue("EMAIL_WHITELIST");
		const emailWhitelist = emailWhitelistPatternsString?.trim()
			? emailWhitelistPatternsString?.split(",")
			: [];

		// If there are whitelist patterns, check if the email is allowed to sign up
		if (emailDomainWhitelist.length > 0 || emailWhitelist.length > 0) {
			const domainMatch = emailDomainWhitelist?.includes(email.split("@")[1]);
			const emailMatch = emailWhitelist?.includes(email);
			if (!domainMatch && !emailMatch) {
				return setError(`Email is not from a whitelisted domain.`);
			}
		}

		const { error } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				emailRedirectTo: `${ROOT_URL}/${Routes.Setup}`,
			},
		});

		// Show error message and return early if the signup failed
		if (error) {
			setError(error.message);
			return;
		}

		// Handle successful signup
		closeAuthModal();
		setAuthFormType(AuthFormType.Login);

		if (!EMAIL_VERIFICATION) {
			// Temporary workaround: Reload to set the access/refresh token properly
			window.location.reload();
			router.push(Routes.Setup);
		} else {
			toast.success("Check inbox to verify email address");
			router.push(Routes.Login);
		}
	}

	return (
		<>
			<p className="pb-2 text-center text-2xl font-medium">Join Metadachi!</p>
			<form className="flex flex-col gap-3" onSubmit={handleSignup}>
				<EmailInput hasError={isInvalid} />
				<PasswordInput label="" isInvalid={isInvalid} errorMessage={error} />
				{/*<Checkbox isRequired className="py-4" size="sm">*/}
				{/*  I agree with the&nbsp;*/}
				{/*  <Link href="#" size="sm">*/}
				{/*    Terms*/}
				{/*  </Link>*/}
				{/*  &nbsp; and&nbsp;*/}
				{/*  <Link href="#" size="sm">*/}
				{/*    Privacy Policy*/}
				{/*  </Link>*/}
				{/*</Checkbox>*/}
				<Button color="primary" type="submit">
					Sign Up
				</Button>
			</form>

			<div className="flex items-center gap-4 py-2">
				<Divider className="flex-1" />
				<p className="shrink-0 text-tiny text-default-500">OR</p>
				<Divider className="flex-1" />
			</div>
			<OAuthButtons />
			<p className="text-center text-small">
				Already have an account?&nbsp;
				<Link
					size="sm"
					className="cursor-pointer"
					onClick={() => setAuthFormType(AuthFormType.Login)}
				>
					Log In
				</Link>
			</p>
		</>
	);
}
