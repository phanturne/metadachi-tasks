"use client";

import { AvatarImageInput } from "@/components/input/AvatarImageInput";
import {
	DisplayNameInput,
	UsernameInput,
} from "@/components/input/ProfileInputs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "@/lib/hooks/use-session";
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
		<div className="space-y-6">
			<Card className="bg-card">
				<CardContent className="p-6">
					<div className="flex items-center gap-4">
						<AvatarImageInput
							src={profileImagePath}
							name={displayName ?? username}
							onSrcChange={setProfileImagePath}
							onImageChange={setProfileImageFile}
						/>
						<div>
							<p className="font-semibold text-lg">
								{displayName && displayName.trim() !== ""
									? displayName
									: username}
								{isAnonymous && (
									<Badge variant="secondary" className="ml-2">
										Guest
									</Badge>
								)}
							</p>
							<p className="text-muted-foreground text-sm">@{username}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="space-y-4">
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
		</div>
	);
};
