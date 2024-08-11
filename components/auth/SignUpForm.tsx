// Source: https://github.com/mckaywrigley/chatbot-ui/blob/d60e1f3ee9d2caf8c9aab659791b841690183b2d/%5Blocale%5D/login/page.tsx#L145

import OAuthButtons from "@/components/auth/OAuthButtons";
import { GuestLoginButton } from "@/components/auth/guest-login-button";
import { EmailInput, PasswordInput } from "@/components/input";
import {
	AuthFormType,
	useAuthModal,
} from "@/components/providers/auth-context-provider";
import { EMAIL_VERIFICATION } from "@/lib/config";
import { Routes } from "@/lib/constants";
import { supabase } from "@/lib/supabase/browser-client";
import { Button, Divider, Link } from "@nextui-org/react";
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

		// Show error message and return early if the signup failed
		if (error) {
			setError(error.message);
			return;
		}

		// Handle successful signup
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
			<GuestLoginButton />
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
