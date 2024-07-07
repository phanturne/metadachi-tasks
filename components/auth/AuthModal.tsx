import AuthForm from "@/components/auth/AuthForm";
import type { AuthFormType } from "@/components/providers/auth-context-provider";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import Image from "next/image";

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
		<Modal size="sm" isOpen={open} onOpenChange={onClose}>
			<ModalContent className="p-4">
				<ModalHeader className="justify-center">
					<Image
						src="/apple-touch-icon.png"
						alt="Metadachi Icon"
						width={50}
						height={50}
					/>
				</ModalHeader>
				<ModalBody>
					<AuthForm type={type} />
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
