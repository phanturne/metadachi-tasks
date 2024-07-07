"use client";

import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { LoginForm } from "@/components/auth/LoginForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { AuthFormType } from "@/components/providers/auth-context-provider";
import { useState } from "react";

export default function AuthForm({ type }: { type?: AuthFormType }) {
	const [formType, setFormType] = useState<AuthFormType>(
		type ?? AuthFormType.Login,
	);

	return (
		<>
			{formType === AuthFormType.Login && (
				<LoginForm setAuthFormType={setFormType} />
			)}
			{formType === AuthFormType.SignUp && (
				<SignUpForm setAuthFormType={setFormType} />
			)}
			{formType === AuthFormType.ForgotPassword && (
				<ForgotPasswordForm setAuthFormType={setFormType} />
			)}
			{formType === AuthFormType.ResetPassword && <ResetPasswordForm />}
		</>
	);
}
