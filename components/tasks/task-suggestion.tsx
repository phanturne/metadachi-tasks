"use client";

import { createTask } from "@/lib/db/tasks";
import { useSession } from "@/lib/hooks/use-session";
import { markTasksAsStale } from "@/lib/hooks/use-tasks";
import { formatDateTime } from "@/lib/utils";
import type { Tables } from "@/supabase/types";
import { Card, Checkbox } from "@nextui-org/react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

export function TaskSuggestion({ task }: { task: Tables<"tasks"> }) {
	const { session } = useSession();
	const [isChecked, setIsChecked] = useState(false);

	const onCheckboxChange = async (checked: boolean) => {
		setIsChecked(checked);

		const taskData = {
			...task,
			user_id: session?.user.id,
		} as Tables<"tasks">;

		// Handle task creation
		const data = await createTask(taskData);
		if (data) {
			markTasksAsStale(taskData.user_id);
			toast.success("Task created successfully!");
		}
	};

	return (
		<Card className="flex flex-row justify-between items-center p-4 cursor-pointer w-full border border-gray-300 dark:border-gray-700">
			<div className="flex gap-2 items-center w-full">
				<Checkbox
					isSelected={isChecked}
					onValueChange={onCheckboxChange}
					isDisabled={isChecked}
				/>

				<div className="flex w-full justify-between">
					<div className="flex flex-col items-start">
						<h4 className="text-lg">{task.name}</h4>
						<p className="text-sm">
							Difficulty: {task.difficulty} ({task.gold} Gold)
						</p>
					</div>
					<p className="text-md justify-end">
						{task.end_time && (
							<p className="text-sm">{formatDateTime(task.end_time)}</p>
						)}
					</p>
				</div>
			</div>
		</Card>
	);
}
