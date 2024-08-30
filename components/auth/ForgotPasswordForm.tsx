import { EmailInput } from "@/components/input";
import {
	AuthFormType,
	useAuthModal,
} from "@/components/providers/auth-context-provider";
import { Button } from "@/components/ui/button";
import { Routes } from "@/lib/constants";
import { supabase } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";
import type React from "react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

export function ForgotPasswordForm({
	setAuthFormType,
}: {
	setAuthFormType: React.Dispatch<React.SetStateAction<AuthFormType>>;
}) {
	const [error, setError] = useState<string>("");
	const isInvalid = error !== "";
	const { closeAuthModal } = useAuthModal();
	const router = useRouter();

	async function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const email = formData.get("email") as string;

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${process.env.NEXT_PUBLIC_ROOT_URL}${Routes.ResetPassword}`,
		});

		if (error) {
			setError(error.message);
			return;
		}

		closeAuthModal();
		setAuthFormType(AuthFormType.Login);
		toast.success("Password reset email sent.");
		return router.push(Routes.Home);
	}

	return (
		<div className="space-y-4">
			<h2 className="text-center font-medium text-2xl">
				Forgot your password?
			</h2>
			<form className="space-y-4" onSubmit={handleForgotPassword}>
				<EmailInput hasError={isInvalid} />
				<Button className="w-full" type="submit">
					Send Password Reset Email
				</Button>
				<div className="text-center text-sm">
					<Button
						variant="link"
						className="p-0"
						onClick={() => setAuthFormType(AuthFormType.Login)}
					>
						Login
					</Button>
					{" · "}
					<Button
						variant="link"
						className="p-0"
						onClick={() => setAuthFormType(AuthFormType.SignUp)}
					>
						Sign Up
					</Button>
				</div>
			</form>
		</div>
	);
}
