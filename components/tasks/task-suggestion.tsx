"use client";

import type { Tables } from "@/supabase/types";
import { Card, Checkbox } from "@nextui-org/react";
import type React from "react";
import { useState } from "react";

export function TaskSuggestion({ task }: { task: Partial<Tables<"tasks">> }) {
	const [isChecked, setIsChecked] = useState(false);

	const onCheckboxChange = (checked: boolean) => {
		setIsChecked(checked);
		console.log("task selected:", task);
	};

	return (
		<Card className="flex flex-row justify-between items-center p-4 cursor-pointer w-full border border-gray-300 dark:border-gray-700">
			<div className="flex gap-2 items-center w-full">
				<Checkbox isSelected={isChecked} onValueChange={onCheckboxChange} />

				<div className="flex w-full justify-between">
					<div className="flex flex-col items-start">
						<h4 className="text-lg">{task.name}</h4>
						<p className="text-sm">
							Difficulty: {task.difficulty} ({task.gold} Gold)
						</p>
					</div>
					<p className="text-md justify-end">
						Due: {task.end_time ? task.end_time : "N/A"}
					</p>
				</div>
			</div>
		</Card>
	);
}
