import { createTask } from "@/lib/db/tasks";
import { useSession } from "@/lib/hooks/use-session";
import { markTasksAsStale } from "@/lib/hooks/use-tasks";
import type { Tables } from "@/supabase/types";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Slider,
	Textarea,
	useDisclosure,
} from "@nextui-org/react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

const EmptyTask: Partial<Tables<"tasks">> = {
	name: "New Task",
	parts_per_instance: 1,
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
			markTasksAsStale(taskData.user_id);
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
								<Slider
									label="Total Parts"
									minValue={1}
									maxValue={10}
									value={task.parts_per_instance || 1}
									onChange={(value) => {
										setTask({
											...task,
											parts_per_instance: value as number,
										});
									}}
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
