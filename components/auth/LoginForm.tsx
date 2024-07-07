// Adapted from https://github.com/mckaywrigley/chatbot-ui/blob/d60e1f3ee9d2caf8c9aab659791b841690183b2d/%5Blocale%5D/login/page.tsx#L145

import OAuthButtons from "@/components/auth/OAuthButtons";
import { EmailInput, PasswordInput } from "@/components/input";
import {
	AuthFormType,
	useAuthModal,
} from "@/components/providers/auth-context-provider";
import { supabase } from "@/lib/supabase/browser-client";
import { Button, Checkbox, Divider, Link } from "@nextui-org/react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

type LoginFormValues = {
	email: string;
	password: string;
};

export function LoginForm({
	setAuthFormType,
}: {
	setAuthFormType: React.Dispatch<React.SetStateAction<AuthFormType>>;
}) {
	const [error, setError] = useState<string>("");
	const isInvalid = error !== "";
	const { closeAuthModal } = useAuthModal();

	async function handleLogin(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const formJson = Object.fromEntries(formData.entries());
		const { email, password } = formJson as LoginFormValues;

		const { error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

		// Show error message and return early if the login failed
		if (error) {
			setError(error.message);
			return;
		}

		// if (isAnonymous) {
		//   await supabase.auth.updateUser({ email: email })
		//
		//   // verify the user's email by clicking on the email change link
		//   // or entering the 6-digit OTP sent to the email address
		//
		//   // Once the user has been verified, update the password
		//   await supabase.auth.updateUser({ password: password })
		// }

		// Handle successful login
		toast.success("Successfully logged in");
		closeAuthModal();
		window.location.reload();
	}

	return (
		<>
			<p className="pb-2 text-center text-2xl font-medium">Welcome back!</p>
			<form className="flex flex-col gap-3" onSubmit={handleLogin}>
				<EmailInput hasError={isInvalid} />
				<PasswordInput label="" isInvalid={isInvalid} errorMessage={error} />
				<div className="flex items-center justify-between px-1 py-2">
					<Checkbox name="remember" size="sm">
						Remember me
					</Checkbox>
					<Link
						className="text-default-500"
						href=""
						size="sm"
						onClick={() => setAuthFormType(AuthFormType.ForgotPassword)}
					>
						Forgot password?
					</Link>
				</div>
				<Button color="primary" type="submit">
					Log In
				</Button>
			</form>
			<div className="flex items-center gap-4 py-2">
				<Divider className="flex-1" />
				<p className="shrink-0 text-tiny text-default-500">OR</p>
				<Divider className="flex-1" />
			</div>
			<OAuthButtons />
			<p className="pt-2 text-center text-small">
				New to Metadachi?&nbsp;
				<Link
					size="sm"
					className="cursor-pointer"
					onClick={() => setAuthFormType(AuthFormType.SignUp)}
				>
					Sign Up
				</Link>
			</p>
		</>
	);
}
