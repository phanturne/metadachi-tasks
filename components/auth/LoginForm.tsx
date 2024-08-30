// Adapted from https://github.com/mckaywrigley/chatbot-ui/blob/d60e1f3ee9d2caf8c9aab659791b841690183b2d/%5Blocale%5D/login/page.tsx#L145

import OAuthButtons from "@/components/auth/OAuthButtons";
import { GuestLoginButton } from "@/components/auth/guest-login-button";
import { EmailInput, PasswordInput } from "@/components/input";
import {
	AuthFormType,
	useAuthModal,
} from "@/components/providers/auth-context-provider";
import { Routes } from "@/lib/constants";
import { supabase } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

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
	const router = useRouter();

	async function handleLogin(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const formJson = Object.fromEntries(formData.entries());
		const { email, password } = formJson as LoginFormValues;

		const { error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

		if (error) {
			setError(error.message);
			return;
		}

		toast.success("Successfully logged in");
		closeAuthModal();
		window.location.reload();
		router.push(Routes.Home);
	}

	return (
		<>
			<p className="pb-2 text-center font-medium text-2xl">Welcome back!</p>
			<form className="flex flex-col gap-3" onSubmit={handleLogin}>
				<EmailInput hasError={isInvalid} />
				<PasswordInput label="" isInvalid={isInvalid} errorMessage={error} />
				<div className="flex items-center justify-between px-1 py-2">
					<div className="flex items-center space-x-2">
						<Checkbox id="remember" />
						<label
							htmlFor="remember"
							className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Remember me
						</label>
					</div>
					<Link
						href="#"
						onClick={() => setAuthFormType(AuthFormType.ForgotPassword)}
						className="text-sm hover:underline"
					>
						Forgot password?
					</Link>
				</div>
				<Button type="submit">Log In</Button>
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
				onClick={() => setAuthFormType(AuthFormType.SignUp)}
			>
				New to Metadachi? Sign Up
			</Button>
		</>
	);
}
