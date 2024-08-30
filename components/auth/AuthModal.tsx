import AuthForm from "@/components/auth/AuthForm";
import type { AuthFormType } from "@/components/providers/auth-context-provider";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import Image from "next/image";
import * as React from "react";

export default function AuthModal({
	open,
	onClose,
	type,
}: {
	open: boolean;
	onClose: () => void;
	type?: AuthFormType;
}) {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader className="flex flex-col items-center justify-center pt-4">
					<div className="relative h-[50px] w-[50px]">
						<Image
							src="/apple-touch-icon.png"
							alt="Metadachi Icon"
							fill
							className="object-contain"
						/>
					</div>
				</DialogHeader>
				<AuthForm type={type} />
			</DialogContent>
		</Dialog>
	);
}
