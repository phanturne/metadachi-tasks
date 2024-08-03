import type { TaskWithInstances } from "@/lib/db/tasks";
import { formatDateTime } from "@/lib/utils";
import type { Tables } from "@/supabase/types";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react";
import React from "react";

interface TaskModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
	task: TaskWithInstances;
	instance: Tables<"task_instances">;
	onIncrement: () => void;
	onDecrement: () => void;
	onDelete: () => void;
	onUpdateInstance: (updates: Partial<Tables<"task_instances">>) => void;
}

export function TaskModal({
	isOpen,
	onOpenChange,
	task,
	instance,
	onIncrement,
	onDecrement,
	onDelete,
	onUpdateInstance,
}: TaskModalProps) {
	const canIncrement =
		(instance.completed_parts ?? 0) < (instance.total_parts ?? 0) &&
		!instance.is_completed;
	const canDecrement =
		(instance.completed_parts ?? 0) > 0 && !instance.is_completed;

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							{task.name}
						</ModalHeader>
						<ModalBody>
							{/*<Input*/}
							{/*	label="Name"*/}
							{/*	value={task.name}*/}
							{/*	onChange={(e) => onUpdateInstance({ name: e.target.value })}*/}
							{/*/>*/}
							{/*<Textarea*/}
							{/*	label="Description"*/}
							{/*	value={task.description || ""}*/}
							{/*	onChange={(e) => onUpdateInstance({ description: e.target.value })}*/}
							{/*/>*/}
							{/*<Textarea*/}
							{/*	label="Notes"*/}
							{/*	value={instance.notes || ""}*/}
							{/*	onChange={(e) => onUpdateInstance({ notes: e.target.value })}*/}
							{/*/>*/}
							<div className="flex flex-col gap-2">
								{task.end_time && (
									<p className="text-sm">{formatDateTime(task.end_time)}</p>
								)}
							</div>
							<div className="flex items-center gap-2">
								<p>Progress:</p>
								<Button
									isIconOnly
									size="sm"
									variant="flat"
									color="success"
									onClick={onIncrement}
									isDisabled={!canIncrement}
								>
									+
								</Button>
								<p>{`${instance.completed_parts ?? 0} / ${instance.total_parts ?? 0}`}</p>
								<Button
									isIconOnly
									size="sm"
									variant="flat"
									color="danger"
									onClick={onDecrement}
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
							<Button color="primary" onPress={onClose}>
								Save
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
