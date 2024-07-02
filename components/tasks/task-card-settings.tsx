import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";
import React from "react";

// TODO: Add Settings to hide completed tasks, clear all tasks, change grouping
export function TaskCardSettings() {
	return (
		<Button isIconOnly radius="full" variant="light">
			<Icon icon="solar:menu-dots-bold-duotone" width={24} />
		</Button>
	);
}
