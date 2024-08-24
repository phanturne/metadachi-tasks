// Source: https://github.com/mckaywrigley/chatbot-ui/blob/main/components/utility/profile-settings.tsx

"use client";
import { useAuthModal } from "@/components/providers/auth-context-provider";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { updateProfile } from "@/lib/db/profile";
import { uploadProfileImage } from "@/lib/db/storage/profile-images";
import { markProfileAsStale, useProfile } from "@/lib/hooks/use-profile";
import { useSession } from "@/lib/hooks/use-session";
import type { TablesUpdate } from "@/supabase/types";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingsModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const { openAuthModal } = useAuthModal();
	const { session } = useSession();
	const { profile } = useProfile(session?.user.id);

	const [displayName, setDisplayName] = useState(profile?.display_name || "");
	const [username, setUsername] = useState(profile?.username || "");
	const [usernameAvailable, setUsernameAvailable] = useState(true);
	const [profileImagePath, setProfileImagePath] = useState(
		profile?.image_path || "",
	);
	const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

	useEffect(() => {
		setDisplayName(profile?.display_name || "");
		setUsername(profile?.username || "");
		setProfileImagePath(profile?.image_path || "");
	}, [profile]);

	const handleSave = async () => {
		if (!profile) {
			toast.error("You must be logged in to save user settings.");
			openAuthModal();
			return;
		}

		try {
			let image_url = profile?.image_path || "";
			if (profileImageFile) {
				const { url } = await uploadProfileImage(profile, profileImageFile);
				image_url = url;
			}

			const updateProfilePayload: TablesUpdate<"profiles"> = {
				...profile,
				display_name: displayName,
				username,
				image_path: image_url,
			};

			await updateProfile(profile.id, updateProfilePayload);
			markProfileAsStale(profile.id);
			toast.success("Profile updated successfully!");
		} catch (error) {
			console.error("Error updating profile:", error);
			toast.error("Failed to update profile. Please try again.");
		}
	};

	const handleReset = () => {
		setDisplayName(profile?.display_name || "");
		setUsername(profile?.username || "");
		setUsernameAvailable(true);
		setProfileImagePath(profile?.image_path || "");
	};

	return (
		<Modal size="2xl" isOpen={isOpen} onClose={onClose}>
			<ModalContent>
				<ModalHeader>Settings</ModalHeader>
				<ModalBody>
					<ProfileSettings
						profileImagePath={profileImagePath}
						setProfileImagePath={setProfileImagePath}
						setProfileImageFile={setProfileImageFile}
						username={username}
						usernameAvailable={usernameAvailable}
						onUsernameAvailableChange={setUsernameAvailable}
						onUsernameChange={setUsername}
						displayName={displayName}
						onDisplayNameChange={setDisplayName}
					/>

					<div className="flex justify-end gap-2 pb-4">
						<Button variant="light" onClick={handleReset}>
							Reset
						</Button>
						<Button color="primary" onClick={handleSave}>
							Save
						</Button>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
