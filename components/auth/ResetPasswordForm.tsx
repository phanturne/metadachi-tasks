// Adapted from https://github.com/mckaywrigley/chatbot-ui/blob/d60e1f3ee9d2caf8c9aab659791b841690183b2d/%5Blocale%5D/login/page.tsx#L145

import { PasswordInput } from "@/components/input";
import { Button } from "@/components/ui/button";
import { Routes } from "@/lib/constants";
import { supabase } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";
import React, { type FC, type FormEvent, useState } from "react";
import { toast } from "sonner";

type ResetPasswordFormValues = {
	password: string;
	confirmPassword: string;
};

export const ResetPasswordForm: FC = () => {
	const router = useRouter();
	const [error, setError] = useState<string>("");
	const hasError = error !== "";

	async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const formJson = Object.fromEntries(formData.entries());
		const { password, confirmPassword } = formJson as ResetPasswordFormValues;

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		await supabase.auth.updateUser({ password: password });
		toast.success("Password changed successfully.");
		return router.push(Routes.Home);
	}

	return (
		<>
			<p className="pb-2 text-center font-medium text-2xl">Reset Password</p>
			<form className="flex flex-col gap-3" onSubmit={handleResetPassword}>
				<PasswordInput isInvalid={hasError} />
				<PasswordInput
					name="confirmPassword"
					placeholder="Confirm Password"
					isInvalid={hasError}
					errorMessage={error}
				/>
				<Button type="submit">Confirm Change</Button>
			</form>
		</>
	);
};
