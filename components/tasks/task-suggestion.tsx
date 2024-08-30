"use client";

import { useAuthModal } from "@/components/providers/auth-context-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { createTask } from "@/lib/db/tasks";
import { useSession } from "@/lib/hooks/use-session";
import { markTasksAsStale } from "@/lib/hooks/use-tasks";
import { formatDateTime } from "@/lib/utils";
import type { Tables } from "@/supabase/types";
import { useState } from "react";
import { toast } from "sonner";

export function TaskSuggestion({ task }: { task: Tables<"tasks"> }) {
	const { session } = useSession();
	const [isChecked, setIsChecked] = useState(false);
	const { openAuthModal } = useAuthModal();

	const onCheckboxChange = async (checked: boolean) => {
		if (!session) {
			return openAuthModal();
		}

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
		<Card className="w-full">
			<CardContent className="flex items-center justify-between p-4">
				<div className="flex w-full items-center gap-4">
					<Checkbox
						id={`task-${task.id}`}
						checked={isChecked}
						onCheckedChange={onCheckboxChange}
						disabled={isChecked}
					/>
					<div className="flex flex-grow flex-col">
						<label
							htmlFor={`task-${task.id}`}
							className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							{task.name}
						</label>
						<p className="text-muted-foreground text-sm">
							Difficulty: {task.difficulty} ({task.gold} Gold)
						</p>
					</div>
					{task.end_time && (
						<p className="text-muted-foreground text-sm">
							{formatDateTime(task.end_time)}
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
