import { createTask } from "@/lib/db/tasks";
import { useSession } from "@/lib/hooks/use-session";
import type { Tables } from "@/supabase/types";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea,
	useDisclosure,
} from "@nextui-org/react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

const EmptyTask: Partial<Tables<"tasks">> = {
	name: "New Task",
};

export const NewTaskButton = () => {
	const { session } = useSession();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [task, setTask] = useState<Partial<Tables<"tasks">>>({
		...EmptyTask,
	});

	const handleNewTask = () => {
		onOpen();
	};

	const handleCreateTask = async () => {
		const taskData = {
			...task,
			user_id: session?.user.id,
		} as Tables<"tasks">;

		try {
			await createTask(taskData);
			window.location.reload(); // TODO: Do not reload the page. Use SWR or a context provider instead.
			toast.success("Task created successfully");
		} catch (error) {
			toast.error("Failed to create task");
		}
	};

	return (
		<>
			<Button color="default" onClick={handleNewTask}>
				New Task
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								New Task
							</ModalHeader>
							<ModalBody>
								<Input
									label="Name"
									value={task.name}
									onChange={(e) => setTask({ ...task, name: e.target.value })}
								/>
								<Textarea
									label="Description"
									value={task.description || ""}
									onChange={(e) =>
										setTask({ ...task, description: e.target.value })
									}
								/>
								<div className="flex items-center gap-2">
									<p>Due: {task.end_time}</p>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="light"
									onPress={() => {
										onClose();
									}}
								>
									Cancel
								</Button>
								<Button
									color="primary"
									onPress={() => {
										handleCreateTask();
										onClose();
									}}
								>
									Save
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};
