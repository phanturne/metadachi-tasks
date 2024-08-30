import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type React from "react";

interface GoalOptionProps {
	value: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
}

export const GoalOption: React.FC<GoalOptionProps> = ({
	value,
	checked,
	onCheckedChange,
}) => {
	return (
		<div className="flex cursor-pointer items-center space-x-2 rounded-lg p-2 hover:bg-gray-100">
			<Checkbox
				id={value}
				checked={checked}
				onCheckedChange={onCheckedChange}
			/>
			<Label
				htmlFor={value}
				className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				{value}
			</Label>
		</div>
	);
};
