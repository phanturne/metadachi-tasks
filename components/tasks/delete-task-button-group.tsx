"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Trash } from "lucide-react";
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
		<div className="flex">
			<Button
				variant="destructive"
				onClick={handleAction}
				className="rounded-r-none"
			>
				<Trash className="mr-2 h-4 w-4" />
				{labelsMap[selectedOption]}
			</Button>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="destructive" className="rounded-l-none px-2">
						<ChevronDown className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						onSelect={() => setSelectedOption("delete")}
						className="flex flex-col items-start"
					>
						<span>{labelsMap.delete}</span>
						<span className="text-muted-foreground text-xs">
							{descriptionsMap.delete}
						</span>
					</DropdownMenuItem>
					<DropdownMenuItem
						onSelect={() => setSelectedOption("delete_all")}
						className="flex flex-col items-start"
					>
						<span>{labelsMap.delete_all}</span>
						<span className="text-muted-foreground text-xs">
							{descriptionsMap.delete_all}
						</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
