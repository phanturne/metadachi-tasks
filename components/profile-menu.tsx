"use client";

import { useAuthModal } from "@/components/providers/auth-context-provider";
import SettingsModal from "@/components/settings/settings-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeSwitcher from "@/components/utility/theme-switcher";
import { useProfile } from "@/lib/hooks/use-profile";
import { useSession } from "@/lib/hooks/use-session";
import { useSignOut } from "@/lib/hooks/use-sign-out";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

const Routes = {
	Assistants: "/assistants",
	Rewards: "/rewards",
	Friends: "/friends",
	Leaderboard: "/leaderboard",
	History: "/history",
	Help: "/help",
};

export default function ProfileMenu({
	placement = "bottom-end",
}: {
	placement?: "left" | "right" | "top" | "bottom" | "bottom-end";
}) {
	const router = useRouter();
	const { openAuthModal } = useAuthModal();
	const { session, isAnonymous } = useSession();
	const { profile } = useProfile(session?.user.id);
	const { handleSignOut } = useSignOut();
	const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

	const name = profile?.display_name?.trim() ?? profile?.username ?? "";
	const finalName = `${name}${isAnonymous ? " (Guest)" : ""}`;
	const profileImageUrl = profile?.image_path;

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="relative h-8 w-8 rounded-full">
						<Avatar className="h-8 w-8">
							<AvatarImage src={profileImageUrl} alt={finalName} />
							<AvatarFallback>{finalName.charAt(0)}</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-56"
					align={placement === "bottom-end" ? "end" : "center"}
					forceMount
				>
					<DropdownMenuLabel className="font-normal">
						<div className="flex gap-2">
							<Avatar className="h-8 w-8">
								<AvatarImage src={profileImageUrl} alt={finalName} />
								<AvatarFallback>{finalName.charAt(0)}</AvatarFallback>
							</Avatar>
							<div className="flex flex-col space-y-1">
								<p className="font-medium text-sm leading-none">{finalName}</p>
								<p className="text-muted-foreground text-xs leading-none">
									{profile?.username ? `@${profile.username}` : "Guest"}
								</p>
							</div>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem onClick={() => router.push(Routes.Assistants)}>
							AI Assistants
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => router.push(Routes.Rewards)}>
							Rewards
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => router.push(Routes.Friends)}>
							Friends & Groups
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => router.push(Routes.Leaderboard)}>
							Leaderboard
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem>
							<div className="flex w-full items-center justify-between">
								Theme
								<ThemeSwitcher />
							</div>
						</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => setIsSettingsOpen(true)}>
							Settings
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => router.push(Routes.History)}>
							History
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => router.push(Routes.Help)}>
						Help & FAQ
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => toast.info("The Feedback feature is coming soon!")}
					>
						Feedback
					</DropdownMenuItem>
					{!session || isAnonymous ? (
						<DropdownMenuItem onClick={() => openAuthModal()}>
							Sign Up / Log In
						</DropdownMenuItem>
					) : (
						<DropdownMenuItem onClick={handleSignOut}>Log Out</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
			<SettingsModal
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
			/>
		</>
	);
}
