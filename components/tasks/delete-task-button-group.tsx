import { Icon } from "@iconify/react";
import {
	Button,
	ButtonGroup,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@nextui-org/react";
import React from "react";

type OptionKey = "delete" | "delete_all";

interface DeleteTaskButtonGroupProps {
	onDeleteInstance: () => void;
	onDeleteTask: () => void;
}

export function DeleteTaskButtonGroup({
	onDeleteInstance,
	onDeleteTask,
}: DeleteTaskButtonGroupProps) {
	const [selectedOption, setSelectedOption] =
		React.useState<OptionKey>("delete");

	const descriptionsMap: Record<OptionKey, string> = {
		delete: "Deletes the current instance of the task.",
		delete_all: "Deletes all instances of the task.",
	};

	const labelsMap: Record<OptionKey, string> = {
		delete: "Delete",
		delete_all: "Delete All Instances",
	};

	const handleAction = () => {
		if (selectedOption === "delete") {
			onDeleteInstance();
		} else {
			onDeleteTask();
		}
	};

	return (
		<ButtonGroup variant="flat" color="danger">
			<Button onClick={handleAction}>{labelsMap[selectedOption]}</Button>
			<Dropdown placement="bottom-end">
				<DropdownTrigger>
					<Button isIconOnly>
						<Icon icon="solar:alt-arrow-down-bold" width={16} height={16} />
					</Button>
				</DropdownTrigger>
				<DropdownMenu
					disallowEmptySelection
					aria-label="delete options"
					selectedKeys={new Set([selectedOption])}
					selectionMode="single"
					onSelectionChange={(keys) => {
						const selected = Array.from(keys)[0] as OptionKey;
						setSelectedOption(selected);
					}}
					className="max-w-[300px]"
				>
					<DropdownItem key="delete" description={descriptionsMap.delete}>
						{labelsMap.delete}
					</DropdownItem>
					<DropdownItem
						key="delete_all"
						description={descriptionsMap.delete_all}
					>
						{labelsMap.delete_all}
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</ButtonGroup>
	);
}
