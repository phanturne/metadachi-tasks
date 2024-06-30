// Source: https://www.nextui.pro/components/application/navigation-headers#component-navigation-header-with-tabs

import NotificationsCard from "@/components/notifications/notifications-card";
import { Icon } from "@iconify/react";
import {
	Badge,
	Button,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@nextui-org/react";
import React from "react";

export function NotificationsMenu() {
	return (
		<Popover offset={12} placement="bottom-end">
			<PopoverTrigger>
				<Button
					disableRipple
					isIconOnly
					className="overflow-visible"
					radius="full"
					variant="light"
				>
					<Badge color="danger" content="5" showOutline={false} size="sm">
						<Icon icon="solar:bell-bold-duotone" width={24} />
					</Badge>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="max-w-[90vw] p-0 sm:max-w-[380px]">
				<NotificationsCard className="w-full shadow-none" />
			</PopoverContent>
		</Popover>
	);
}
