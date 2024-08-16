import { recurrencePatterns } from "@/components/tasks/new-task-button";
import { capitalizeWord } from "@/lib/utils";
import type { Tables } from "@/supabase/types";
import { parseAbsoluteToLocal } from "@internationalized/date";
import {
	Button,
	DatePicker,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	Textarea,
} from "@nextui-org/react";
import type React from "react";
import { useState } from "react";

interface TaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	task: Tables<"tasks">;
	instance: Tables<"task_instances">;
	onDelete: () => void;
	onIncrement: (instance: Tables<"task_instances">) => void;
	onDecrement: (instance: Tables<"task_instances">) => void;
	onSave: (task: Tables<"tasks">, instance: Tables<"task_instances">) => void;
}

export function TaskModal({
	isOpen,
	onClose,
	task,
	instance,
	onDelete,
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
		<Modal isOpen={isOpen} onClose={onClose} size="2xl">
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">{task.name}</ModalHeader>
				<ModalBody>
					<Input
						label="Name"
						value={localTask.name || ""}
						onChange={(e) =>
							setLocalTask({ ...localTask, name: e.target.value })
						}
					/>

					<div className="flex items-center gap-2">
						<p>Progress:</p>
						<Button
							isIconOnly
							size="sm"
							variant="flat"
							color="success"
							onClick={() => onIncrement(localInstance)}
							isDisabled={!canIncrement}
						>
							+
						</Button>
						<p>{`${localInstance.is_completed ? localInstance.total_parts ?? 0 : localInstance.completed_parts ?? 0} / ${localInstance.total_parts ?? 0}`}</p>
						<Button
							isIconOnly
							size="sm"
							variant="flat"
							color="danger"
							onClick={() => onDecrement(localInstance)}
							isDisabled={!canDecrement}
						>
							-
						</Button>
					</div>

					<div className="flex gap-2">
						<DatePicker
							label="Deadline"
							value={
								localTask.end_time
									? parseAbsoluteToLocal(localTask.end_time)
									: undefined
							}
							onChange={(v) => {
								const dateWithMidnight = new Date(
									v.year,
									v.month - 1,
									v.day,
									v?.hour ?? 0,
									v?.minute ?? 0,
								);
								setLocalTask({
									...localTask,
									end_time: dateWithMidnight.toISOString(),
								});
							}}
						/>

						<Input
							label="Gold"
							type="number"
							value={(localTask.gold ?? "").toString()}
							onChange={(e) => {
								// Parse the input value as an integer
								const intValue = Number.parseInt(e.target.value, 10);

								// Only update the task if the parsed value is a valid number
								if (!Number.isNaN(intValue)) {
									setLocalTask({ ...localTask, gold: intValue });
								} else {
									setLocalTask({ ...localTask, gold: 0 }); // or handle the case where input is invalid
								}
							}}
							min="0"
						/>
					</div>

					{localTask.end_time && (
						<div className="flex gap-2">
							<Select
								label="Repeat"
								selectedKeys={[task.recurrence_interval ?? "NEVER"]}
								className="max-w-xs"
								onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
									setLocalTask({
										...localTask,
										recurrence_interval: e.target.value,
									});
								}}
							>
								{recurrencePatterns.map((pattern) => (
									<SelectItem key={pattern}>
										{capitalizeWord(pattern)}
									</SelectItem>
								))}
							</Select>

							<DatePicker
								isDisabled={localTask.recurrence_interval === "NEVER"}
								label="End Repeat"
								value={
									localTask.end_repeat
										? parseAbsoluteToLocal(localTask.end_repeat)
										: undefined
								}
								onChange={(v) => {
									const dateWithMidnight = new Date(
										v.year,
										v.month - 1,
										v.day,
										v?.hour ?? 0,
										v?.minute ?? 0,
									);
									setLocalTask({
										...localTask,
										end_repeat: dateWithMidnight.toISOString(),
									});
								}}
							/>
						</div>
					)}

					<Textarea
						label="Description"
						value={localTask.description || ""}
						onChange={(e) =>
							setLocalTask({ ...localTask, description: e.target.value })
						}
					/>
					<Textarea
						label="Notes"
						value={localInstance.notes || ""}
						onChange={(e) =>
							setLocalInstance({ ...localInstance, notes: e.target.value })
						}
					/>
				</ModalBody>
				<ModalFooter>
					<Button
						color="danger"
						variant="light"
						onPress={() => {
							onDelete();
							onClose();
						}}
					>
						Delete
					</Button>
					<Button
						color="primary"
						onPress={() => {
							onSave(localTask, localInstance);
							onClose();
						}}
					>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
