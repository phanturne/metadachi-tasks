import { useAuthModal } from "@/components/providers/auth-context-provider";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { createTask } from "@/lib/db/tasks";
import { useSession } from "@/lib/hooks/use-session";
import { markTasksAsStale } from "@/lib/hooks/use-tasks";
import { capitalizeWord } from "@/lib/utils";
import type { Tables } from "@/supabase/types";
import { Repeat } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EmptyTask: Partial<Tables<"tasks">> = {
	name: "",
	parts_per_instance: 1,
	end_time: undefined,
};

export const recurrencePatterns = [
	"NEVER",
	"HOURLY",
	"DAILY",
	"WEEKLY",
	"WEEKDAYS",
	"WEEKENDS",
	"BIWEEKLY",
	"MONTHLY",
	"YEARLY",
	"INFINITE",
];

export function NewTaskButton() {
	const { session } = useSession();
	const { openAuthModal } = useAuthModal();
	const [isOpen, setIsOpen] = useState(false);
	const [task, setTask] = useState<Partial<Tables<"tasks">>>({ ...EmptyTask });

	const handleNewTask = () => {
		if (!session) {
			return openAuthModal();
		}
		setIsOpen(true);
	};

	const handleCreateTask = async () => {
		const taskData = {
			...task,
			user_id: session?.user.id,
		} as Tables<"tasks">;

		try {
			await createTask(taskData);
			markTasksAsStale(taskData.user_id);
			setTask(EmptyTask);
			toast.success("Task created successfully");
			setIsOpen(false);
		} catch (error) {
			toast.error("Failed to create task");
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" onClick={handleNewTask}>
					New Task
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle className="font-semibold text-2xl">
						Create New Task
					</DialogTitle>
					<DialogDescription>
						Add a new task to your list. Fill in the details below.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-6 py-4">
					<div className="grid gap-2">
						<Label htmlFor="name">Task Name</Label>
						<Input
							id="name"
							placeholder="Enter task name"
							value={task.name}
							onChange={(e) => setTask({ ...task, name: e.target.value })}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="parts">Total Parts</Label>
						<div className="flex items-center gap-4">
							<Slider
								id="parts"
								min={1}
								max={50}
								step={1}
								value={[task.parts_per_instance || 1]}
								onValueChange={(value) =>
									setTask({ ...task, parts_per_instance: value[0] })
								}
								className="flex-grow"
							/>
							<Input
								type="number"
								value={task.parts_per_instance || 1}
								onChange={(e) => {
									let v = Number(e.target.value);
									if (Number.isInteger(v)) {
										if (v < 1) v = 1;
										if (v > 50) v = 50;
										setTask({ ...task, parts_per_instance: v });
									}
								}}
								className="w-16"
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label>Deadline</Label>
							<DateTimePicker
								hourCycle={24}
								value={task.end_time ? new Date(task.end_time) : undefined}
								onChange={(date) =>
									setTask({ ...task, end_time: date?.toISOString() })
								}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="gold">Gold Reward</Label>
							<Input
								id="gold"
								type="number"
								placeholder="Enter gold amount"
								value={(task.gold ?? "").toString()}
								onChange={(e) => {
									const intValue = Number.parseInt(e.target.value, 10);
									if (!Number.isNaN(intValue)) {
										setTask({ ...task, gold: intValue });
									} else {
										setTask({ ...task, gold: 0 });
									}
								}}
								min="0"
							/>
						</div>
					</div>
					{task.end_time && (
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="recurrence">Repeat</Label>
								<Select
									value={task.recurrence_interval ?? "NEVER"}
									onValueChange={(value) =>
										setTask({ ...task, recurrence_interval: value })
									}
								>
									<SelectTrigger id="recurrence">
										<SelectValue placeholder="Select recurrence" />
									</SelectTrigger>
									<SelectContent>
										{recurrencePatterns.map((pattern) => (
											<SelectItem key={pattern} value={pattern}>
												{capitalizeWord(pattern)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-2">
								<Label>End Repeat</Label>
								<DateTimePicker
									hourCycle={24}
									value={
										task.end_repeat ? new Date(task.end_repeat) : undefined
									}
									icon={<Repeat className="mr-2 h-4 w-4" />}
									onChange={(date) =>
										setTask({ ...task, end_repeat: date?.toISOString() })
									}
								/>
							</div>
						</div>
					)}
					<div className="grid gap-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="Describe your task"
							value={task.description || ""}
							onChange={(e) =>
								setTask({ ...task, description: e.target.value })
							}
							className="h-24"
						/>
					</div>
				</div>
				<DialogFooter className="gap-2 sm:gap-0">
					<Button variant="outline" onClick={() => setIsOpen(false)}>
						Cancel
					</Button>
					<Button onClick={handleCreateTask} disabled={!task.name}>
						Create Task
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
