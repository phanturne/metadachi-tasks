import { Checkbox, cn } from "@nextui-org/react";
import type React from "react";

interface GoalOptionProps {
	value: string;
}

export const GoalOption: React.FC<GoalOptionProps> = ({ value }) => {
	return (
		<Checkbox
			aria-label={value}
			classNames={{
				base: cn(
					"inline-flex max-w-md w-full bg-content1 m-0",
					"hover:bg-content2 items-center justify-start",
					"cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
					"data-[selected=true]:border-primary",
				),
				label: "w-full",
			}}
			value={value}
		>
			<p>{value}</p>
		</Checkbox>
	);
};
