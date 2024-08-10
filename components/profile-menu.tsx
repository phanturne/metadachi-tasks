import { useAuthModal } from "@/components/providers/auth-context-provider";
import ThemeSwitcher from "@/components/utility/theme-switcher";
import { Routes } from "@/lib/constants";
import { useProfile } from "@/lib/hooks/use-profile";
import { useSession } from "@/lib/hooks/use-session";
import { useSignOut } from "@/lib/hooks/use-sign-out";
import { getImageUrl } from "@/lib/supabase/utils";
import {
	Avatar,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
} from "@nextui-org/react";
import { User } from "@nextui-org/user";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

// TODO: Add icons to the dropdown items
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

	const name = profile?.display_name?.trim() ?? profile?.username ?? "";
	const finalName = `${name}${isAnonymous ? " (Guest)" : ""}`;
	const profileImageUrl =
		profile?.image_path && getImageUrl(profile.id, profile.image_path);

	return (
		<>
			<Dropdown
				placement={placement}
				classNames={{
					content: "p-0 border-small border-divider bg-background",
				}}
			>
				<DropdownTrigger>
					<Avatar
						as="button"
						size="sm"
						showFallback
						name={finalName}
						src={profileImageUrl}
					/>
				</DropdownTrigger>
				<DropdownMenu
					aria-label="Profile Menu"
					disabledKeys={["profile"]}
					className="w-60 p-3"
					itemClasses={{
						base: [
							"rounded-md",
							"text-default-500",
							"transition-opacity",
							"data-[hover=true]:text-foreground",
							"data-[hover=true]:bg-default-100",
							"dark:data-[hover=true]:bg-default-50",
							"data-[selectable=true]:focus:bg-default-50",
							"data-[pressed=true]:opacity-70",
							"data-[focus-visible=true]:ring-default-500",
						],
					}}
				>
					<DropdownSection aria-label="Profile & Actions" showDivider>
						<DropdownItem
							isReadOnly
							key="profile"
							className="h-14 gap-2 opacity-100"
						>
							<User
								name={finalName}
								description={
									profile?.username ? `@${profile.username}` : "Guest"
								}
								classNames={{
									name: "text-default-600",
									description: "text-default-500",
								}}
								avatarProps={{
									size: "sm",
									src: profileImageUrl,
									showFallback: true,
									name: profile?.display_name ?? profile?.username,
								}}
							/>
						</DropdownItem>
						<DropdownItem
							key="assistants"
							onClick={() => router.push(Routes.Assistants)}
						>
							AI Assistants
						</DropdownItem>
						<DropdownItem
							key="rewards"
							onClick={() => router.push(Routes.Rewards)}
						>
							Rewards
						</DropdownItem>
						<DropdownItem
							key="groups"
							onClick={() => router.push(Routes.Friends)}
						>
							Friends & Groups
						</DropdownItem>
						<DropdownItem
							key="leaderboard"
							onClick={() => router.push(Routes.Leaderboard)}
						>
							Leaderboard
						</DropdownItem>
					</DropdownSection>

					<DropdownSection aria-label="Preferences" showDivider>
						<DropdownItem
							isReadOnly
							key="theme"
							className="cursor-default"
							endContent={<ThemeSwitcher />}
						>
							Theme
						</DropdownItem>
						<DropdownItem
							key="settings"
							onClick={() => router.push(Routes.Settings)}
						>
							Settings
						</DropdownItem>
						<DropdownItem
							key="history"
							onClick={() => router.push(Routes.History)}
						>
							History
						</DropdownItem>
					</DropdownSection>

					<DropdownSection aria-label="Help & FAQ">
						<DropdownItem
							key="help_and_faq"
							onClick={() => router.push(Routes.Help)}
						>
							Help & FAQ
						</DropdownItem>
						<DropdownItem
							key="feedback"
							onClick={() => toast.info("The Feedback feature is coming soon!")}
						>
							Feedback
						</DropdownItem>
						{!session || isAnonymous ? (
							<DropdownItem key="login" onClick={() => openAuthModal()}>
								{"Sign Up / Log In"}
							</DropdownItem>
						) : (
							<DropdownItem key="logout" onClick={handleSignOut}>
								Log Out
							</DropdownItem>
						)}
					</DropdownSection>
				</DropdownMenu>
			</Dropdown>
		</>
	);
}
