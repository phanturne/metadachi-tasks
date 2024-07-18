import type { TaskWithInstances } from "@/lib/db/tasks";
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
}

export function TaskModal({
	isOpen,
	onOpenChange,
	task,
	instance,
}: TaskModalProps) {
	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							{task.name}
						</ModalHeader>
						<ModalBody>
							<p>Due: {task.end_time}</p>
							<p>Completed: {instance.is_completed ? "Yes" : "No"}</p>
							<p>
								Progress: {instance.completed_parts ?? 0} /{" "}
								{instance.total_parts ?? 0}
							</p>
							{/* Add more task details here */}
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="light" onPress={onClose}>
								Close
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
