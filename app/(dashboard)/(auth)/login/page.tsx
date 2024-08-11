"use client";

import AuthForm from "@/components/auth/AuthForm";
import { AuthFormType } from "@/components/providers/auth-context-provider";
import { Routes } from "@/lib/constants";
import { useProfile } from "@/lib/hooks/use-profile";
import { useSession } from "@/lib/hooks/use-session";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	// If the user is already logged in, redirect them to the dashboard
	const { session } = useSession();
	const { profile } = useProfile(session?.user.id);

	const router = useRouter();

	if (profile) {
		return router.push(Routes.Home);
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
			<AuthForm type={AuthFormType.Login} />
		</>
	);
}
