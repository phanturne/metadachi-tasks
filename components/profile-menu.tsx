// Source: https://www.nextui.pro/components/application/navigation-headers#component-navigation-header-with-tabs

import {
	Avatar,
	Badge,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@nextui-org/react";
import React from "react";

export function ProfileMenu() {
	return (
		<Dropdown placement="bottom-end">
			<DropdownTrigger>
				<button
					type="button"
					className="mt-1 h-8 w-8 outline-none transition-transform"
				>
					<Badge
						color="success"
						content=""
						placement="bottom-right"
						shape="circle"
					>
						<Avatar
							size="sm"
							src="https://i.pravatar.cc/150?u=a04258114e29526708c"
						/>
					</Badge>
				</button>
			</DropdownTrigger>
			<DropdownMenu aria-label="Profile Actions" variant="flat">
				<DropdownItem key="profile" className="h-14 gap-2">
					<p className="font-semibold">Signed in as</p>
					<p className="font-semibold">johndoe@example.com</p>
				</DropdownItem>
				<DropdownItem key="settings">My Settings</DropdownItem>
				<DropdownItem key="team_settings">Team Settings</DropdownItem>
				<DropdownItem key="analytics">Analytics</DropdownItem>
				<DropdownItem key="system">System</DropdownItem>
				<DropdownItem key="configurations">Configurations</DropdownItem>
				<DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
				<DropdownItem key="logout" color="danger">
					Log Out
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
}
