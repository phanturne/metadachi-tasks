// Source: https://github.com/mckaywrigley/chatbot-ui/blob/main/app/%5Blocale%5D/login/password/page.tsx

"use client";

import Loading from "@/app/loading";
import AuthForm from "@/components/auth/AuthForm";
import { AuthFormType } from "@/components/providers/auth-context-provider";
import { Routes } from "@/lib/constants";
import { supabase } from "@/lib/supabase/browser-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	// The protected routes currently check for a profile, but we just need to check for a session here.
	useEffect(() => {
		(async () => {
			const session = (await supabase.auth.getSession()).data.session;

			if (!session) {
				router.push(Routes.Login);
			} else {
				setLoading(false);
			}
		})();
	}, [router]);

	if (loading) {
		return <Loading />;
	}

	return (
		<>
			<div className="flex justify-center items-center p-4">
				<Image
					src="/apple-touch-icon.png"
					alt="Metadachi Icon"
					width={50}
					height={50}
				/>
			</div>
			<AuthForm type={AuthFormType.ResetPassword} />
		</>
	);
}
