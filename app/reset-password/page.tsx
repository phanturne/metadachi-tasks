// Source: https://github.com/mckaywrigley/chatbot-ui/blob/main/app/%5Blocale%5D/login/password/page.tsx

"use client";

import AuthForm from "@/components/auth/AuthForm";
import { AuthFormType } from "@/components/providers/auth-context-provider";
import Image from "next/image";

export default function ResetPasswordPage() {
	return (
		<div className="flex justify-center items-center h-screen p-4">
			<div className="text-center max-w-md w-full p-4">
				<div className="flex justify-center items-center p-4">
					<Image
						src="/apple-touch-icon.png"
						alt="Metadachi Icon"
						width={50}
						height={50}
					/>
				</div>
				<AuthForm type={AuthFormType.ResetPassword} />
			</div>
		</div>
	);
}
