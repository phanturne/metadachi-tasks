// Source: https://github.com/mckaywrigley/chatbot-ui/blob/main/components/setup/profile-step.tsx

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	PROFILE_DISPLAY_NAME_MAX,
	PROFILE_USERNAME_MAX,
	PROFILE_USERNAME_MIN,
} from "@/lib/db/limits";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useCallback, useState } from "react";

export const DisplayNameInput = ({
	displayName,
	onDisplayNameChange,
	labelPlacement = "inside",
}: {
	displayName: string;
	onDisplayNameChange: (name: string) => void;
	labelPlacement?: "inside" | "outside";
}) => {
	return (
		<div className="space-y-2">
			<Label htmlFor="displayName" className="font-medium text-sm">
				Display Name
			</Label>
			<Input
				id="displayName"
				placeholder="Your Display Name"
				value={displayName}
				onChange={(e) => onDisplayNameChange(e.target.value)}
				maxLength={PROFILE_DISPLAY_NAME_MAX}
				className="w-full"
				required
			/>
			<p className="text-muted-foreground text-sm">
				{displayName.length}/{PROFILE_DISPLAY_NAME_MAX}
			</p>
		</div>
	);
};

export const UsernameInput = ({
	username,
	usernameAvailable,
	onUsernameAvailableChange,
	onUsernameChange,
	labelPlacement = "inside",
}: {
	username: string;
	usernameAvailable: boolean;
	onUsernameAvailableChange: (isAvailable: boolean) => void;
	onUsernameChange: (username: string) => void;
	labelPlacement?: "inside" | "outside";
}) => {
	const [loading, setLoading] = useState(false);

	const debounce = (func: (...args: any[]) => void, wait: number) => {
		let timeout: NodeJS.Timeout | null;

		return (...args: any[]) => {
			const later = () => {
				if (timeout) clearTimeout(timeout);
				func(...args);
			};

			if (timeout) clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	};

	const checkUsernameAvailability = useCallback(
		debounce(async (username: string) => {
			if (!username) return;

			if (username.length < PROFILE_USERNAME_MIN) {
				onUsernameAvailableChange(false);
				return;
			}

			if (username.length > PROFILE_USERNAME_MAX) {
				onUsernameAvailableChange(false);
				return;
			}

			const usernameRegex = /^[a-zA-Z0-9_]+$/;
			if (!usernameRegex.test(username)) {
				onUsernameAvailableChange(false);
				alert(
					"Username must be letters, numbers, or underscores only - no other characters or spacing allowed.",
				);
				return;
			}

			setLoading(true);

			const response = await fetch("/api/username/available", {
				method: "POST",
				body: JSON.stringify({ username }),
			});

			const data = await response.json();
			const isAvailable = data.isAvailable;

			onUsernameAvailableChange(isAvailable);

			setLoading(false);
		}, 500),
		[],
	);

	return (
		<div className="space-y-2">
			<Label htmlFor="username" className="font-medium text-sm">
				Your Username
			</Label>
			<div className="relative flex items-center">
				<Input
					id="username"
					placeholder="Username"
					value={username}
					onChange={(e) => {
						onUsernameChange(e.target.value);
						checkUsernameAvailability(e.target.value);
					}}
					minLength={PROFILE_USERNAME_MIN}
					maxLength={PROFILE_USERNAME_MAX}
					className="w-full pr-10"
					required
				/>
				<div className="pointer-events-none absolute right-3 flex h-5 w-5 items-center justify-center">
					{loading ? (
						<Loader2 className="h-6 w-6 animate-spin text-gray-500" />
					) : usernameAvailable ? (
						<CheckCircle className="h-6 w-6 text-green-500" />
					) : (
						<XCircle className="h-6 w-6 text-red-500" />
					)}
				</div>
			</div>
			<p className="text-muted-foreground text-sm">
				{username.length}/{PROFILE_USERNAME_MAX}
			</p>
		</div>
	);
};
