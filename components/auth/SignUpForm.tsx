// Source: https://github.com/mckaywrigley/chatbot-ui/blob/d60e1f3ee9d2caf8c9aab659791b841690183b2d/%5Blocale%5D/login/page.tsx#L145

import OAuthButtons from "@/components/auth/OAuthButtons";
import { GuestLoginButton } from "@/components/auth/guest-login-button";
import { EmailInput, PasswordInput } from "@/components/input";
import {
	AuthFormType,
	useAuthModal,
} from "@/components/providers/auth-context-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EMAIL_VERIFICATION } from "@/lib/config";
import { Routes } from "@/lib/constants";
import { supabase } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";
import type React from "react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

type SignUpFormValues = {
	email: string;
	password: string;
};

export function SignUpForm({
	setAuthFormType,
}: {
	setAuthFormType: React.Dispatch<React.SetStateAction<AuthFormType>>;
}) {
	const [error, setError] = useState<string>("");
	const isInvalid = error !== "";
	const { closeAuthModal } = useAuthModal();
	const router = useRouter();

	async function handleSignup(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const formJson = Object.fromEntries(formData.entries());
		const { email, password } = formJson as SignUpFormValues;

		const { error } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				emailRedirectTo: `${process.env.NEXT_PUBLIC_ROOT_URL}/${Routes.Setup}`,
			},
		});

		if (error) {
			setError(error.message);
			return;
		}

		closeAuthModal();
		setAuthFormType(AuthFormType.Login);

		if (!EMAIL_VERIFICATION) {
			window.location.reload();
			router.push(Routes.Setup);
		} else {
			toast.success("Check inbox to verify email address");
			router.push(Routes.Login);
		}
	}

	return (
		<>
			<p className="pb-2 text-center font-medium text-2xl">Join Metadachi!</p>
			<form className="flex flex-col gap-3" onSubmit={handleSignup}>
				<EmailInput hasError={isInvalid} />
				<PasswordInput label="" isInvalid={isInvalid} errorMessage={error} />
				<Button type="submit">Sign Up</Button>
			</form>

			<div className="relative flex items-center justify-center py-4">
				<Separator className="absolute w-full" />
				<span className="relative z-10 bg-background px-2 text-muted-foreground text-xs">
					OR
				</span>
			</div>
			<OAuthButtons />
			<GuestLoginButton />
			<Button
				variant="link"
				className="w-full p-0 text-center text-sm"
				onClick={() => setAuthFormType(AuthFormType.Login)}
			>
				Already have an account? Log In
			</Button>
		</>
	);
}
