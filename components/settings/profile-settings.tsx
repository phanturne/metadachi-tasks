// Source: https://github.com/mckaywrigley/chatbot-ui/blob/main/components/utility/profile-settings.tsx

"use client";

import { AvatarImageInput } from "@/components/input/AvatarImageInput";
import {
	DisplayNameInput,
	UsernameInput,
} from "@/components/input/ProfileInputs";
import { useSession } from "@/lib/hooks/use-session";
import { Card, CardBody } from "@nextui-org/react";
import React, { type FC } from "react";

interface ProfileSettingsProps {
	profileImagePath: string;
	setProfileImagePath: (src: string) => void;
	setProfileImageFile: (file: File | null) => void;
	username: string;
	usernameAvailable: boolean;
	displayName: string;
	onUsernameAvailableChange: (isAvailable: boolean) => void;
	onUsernameChange: (username: string) => void;
	onDisplayNameChange: (name: string) => void;
}

export const ProfileSettings: FC<ProfileSettingsProps> = ({
	profileImagePath,
	setProfileImagePath,
	setProfileImageFile,
	username,
	usernameAvailable,
	displayName,
	onUsernameAvailableChange,
	onUsernameChange,
	onDisplayNameChange,
}) => {
	const { isAnonymous } = useSession();

	return (
		<div className="flex flex-col gap-4">
			{/* Profile */}
			<Card className="my-4 bg-default-100" shadow="none">
				<CardBody>
					<div className="flex items-center gap-4">
						<AvatarImageInput
							src={profileImagePath}
							name={displayName ?? username}
							onSrcChange={setProfileImagePath}
							onImageChange={setProfileImageFile}
						/>

						<div>
							<p className="font-medium text-default-600 text-sm">
								{(displayName && displayName.trim() !== ""
									? displayName
									: username) + (isAnonymous ? " (Guest)" : "")}
							</p>
							<p className="text-default-400 text-xs">{username}</p>
						</div>
					</div>
				</CardBody>
			</Card>

			<UsernameInput
				username={username}
				usernameAvailable={usernameAvailable}
				onUsernameAvailableChange={onUsernameAvailableChange}
				onUsernameChange={onUsernameChange}
				labelPlacement="outside"
			/>

			<DisplayNameInput
				displayName={displayName}
				onDisplayNameChange={onDisplayNameChange}
				labelPlacement="outside"
			/>
		</div>
	);
};
