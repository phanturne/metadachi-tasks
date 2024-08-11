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
	Textarea,
} from "@nextui-org/react";
import React, { useState } from "react";

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

					<DatePicker
						label="Deadline"
						labelPlacement="outside"
						value={
							localInstance.end_time
								? parseAbsoluteToLocal(localInstance.end_time)
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
							setLocalInstance({
								...instance,
								end_time: dateWithMidnight.toISOString(),
							});
						}}
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
