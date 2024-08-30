import { DeleteTaskButtonGroup } from "@/components/tasks/delete-task-button-group";
import { recurrencePatterns } from "@/components/tasks/new-task-button";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import { capitalizeWord } from "@/lib/utils";
import type { Tables } from "@/supabase/types";
import { Minus, Plus, Repeat } from "lucide-react";
import { useState } from "react";

interface TaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	task: Tables<"tasks">;
	instance: Tables<"task_instances">;
	onDeleteInstance: () => void;
	onDeleteTask: () => void;
	onIncrement: (instance: Tables<"task_instances">) => void;
	onDecrement: (instance: Tables<"task_instances">) => void;
	onSave: (task: Tables<"tasks">, instance: Tables<"task_instances">) => void;
}

export function TaskModal({
	isOpen,
	onClose,
	task,
	instance,
	onDeleteInstance,
	onDeleteTask,
	onIncrement,
	onDecrement,
	onSave,
}: TaskModalProps) {
	const [localTask, setLocalTask] = useState(task);
	const [localInstance, setLocalInstance] = useState(instance);

	const canIncrement =
		(localInstance.completed_parts ?? 0) < (localInstance.total_parts ?? 0) &&
		!localInstance.is_completed;
	const canDecrement =
		(localInstance.completed_parts ?? 0) > 0 && !localInstance.is_completed;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle className="font-semibold text-2xl">
						{task.name}
					</DialogTitle>
				</DialogHeader>
				<div className="grid gap-6 py-4">
					<div className="grid gap-2">
						<Label htmlFor="name">Task Name</Label>
						<Input
							id="name"
							value={localTask.name || ""}
							onChange={(e) =>
								setLocalTask({ ...localTask, name: e.target.value })
							}
						/>
					</div>
					<div className="grid gap-2">
						<Label>Progress</Label>
						<div className="flex items-center gap-2">
							<Button
								size="icon"
								variant="outline"
								onClick={() => onDecrement(localInstance)}
								disabled={!canDecrement}
							>
								<Minus className="h-4 w-4" />
							</Button>
							<span className="min-w-[60px] text-center">
								{`${
									localInstance.is_completed
										? localInstance.total_parts ?? 0
										: localInstance.completed_parts ?? 0
								} / ${localInstance.total_parts ?? 0}`}
							</span>
							<Button
								size="icon"
								variant="outline"
								onClick={() => onIncrement(localInstance)}
								disabled={!canIncrement}
							>
								<Plus className="h-4 w-4" />
							</Button>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label>Deadline</Label>
							<DateTimePicker
								hourCycle={24}
								value={
									localTask.end_time ? new Date(localTask.end_time) : undefined
								}
								onChange={(date) =>
									setLocalTask({
										...localTask,
										end_time: date?.toISOString() ?? null,
									})
								}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="gold">Gold Reward</Label>
							<Input
								id="gold"
								type="number"
								value={(localTask.gold ?? "").toString()}
								onChange={(e) => {
									const intValue = Number.parseInt(e.target.value, 10);
									if (!Number.isNaN(intValue)) {
										setLocalTask({ ...localTask, gold: intValue });
									} else {
										setLocalTask({ ...localTask, gold: 0 });
									}
								}}
								min="0"
							/>
						</div>
					</div>
					{localTask.end_time && (
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="recurrence">Repeat</Label>
								<Select
									value={localTask.recurrence_interval ?? "NEVER"}
									onValueChange={(value) =>
										setLocalTask({ ...localTask, recurrence_interval: value })
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
										localTask.end_repeat
											? new Date(localTask.end_repeat)
											: undefined
									}
									icon={<Repeat className="mr-2 h-4 w-4" />}
									onChange={(date) =>
										setLocalTask({
											...localTask,
											end_repeat: date?.toISOString() ?? null,
										})
									}
									disabled={localTask.recurrence_interval === "NEVER"}
								/>
							</div>
						</div>
					)}
					<div className="grid gap-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							value={localTask.description || ""}
							onChange={(e) =>
								setLocalTask({ ...localTask, description: e.target.value })
							}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="notes">Notes</Label>
						<Textarea
							id="notes"
							value={localInstance.notes || ""}
							onChange={(e) =>
								setLocalInstance({ ...localInstance, notes: e.target.value })
							}
						/>
					</div>
				</div>
				<DialogFooter className="flex justify-between">
					{localTask.recurrence_interval === "NEVER" ? (
						<Button
							variant="destructive"
							onClick={() => {
								onDeleteTask();
								onClose();
							}}
						>
							Delete
						</Button>
					) : (
						<DeleteTaskButtonGroup
							onDeleteTask={() => {
								onDeleteTask();
								onClose();
							}}
							onDeleteInstance={() => {
								onDeleteInstance();
								onClose();
							}}
						/>
					)}
					<Button
						onClick={() => {
							onSave(localTask, localInstance);
							onClose();
						}}
					>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
