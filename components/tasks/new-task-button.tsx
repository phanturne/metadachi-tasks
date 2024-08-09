import { useAuthModal } from "@/components/providers/auth-context-provider";
import { createTask } from "@/lib/db/tasks";
import { useSession } from "@/lib/hooks/use-session";
import { markTasksAsStale } from "@/lib/hooks/use-tasks";
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
	Slider,
	Textarea,
	Tooltip,
	useDisclosure,
} from "@nextui-org/react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

const EmptyTask: Partial<Tables<"tasks">> = {
	name: "",
	parts_per_instance: 1,
	end_time: undefined,
};

export const NewTaskButton = () => {
	const { session } = useSession();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const { openAuthModal } = useAuthModal();

	const [task, setTask] = useState<Partial<Tables<"tasks">>>({
		...EmptyTask,
	});

	const handleNewTask = () => {
		if (!session) {
			return openAuthModal();
		}

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
			setTask(EmptyTask);
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
									isRequired
									value={task.name}
									onChange={(e) => setTask({ ...task, name: e.target.value })}
								/>
								<Slider
									label="Total Parts"
									minValue={1}
									maxValue={50}
									value={task.parts_per_instance || 1}
									onChange={(value) => {
										setTask({
											...task,
											parts_per_instance: value as number,
										});
									}}
									// we extract the default children to render the input
									renderValue={({ children, ...props }) => (
										<output {...props}>
											<Tooltip
												className="text-tiny text-default-500 rounded-md"
												content="Please enter a value from 1 to 50"
												placement="left"
											>
												<input
													className="px-1 py-0.5 w-12 text-right text-small text-default-700 font-medium bg-default-100 outline-none transition-colors rounded-small border-medium border-transparent hover:border-primary focus:border-primary"
													type="text"
													aria-label="Total parts"
													value={task.parts_per_instance || 1}
													onChange={(
														e: React.ChangeEvent<HTMLInputElement>,
													) => {
														let v = Number(e.target.value);

														if (Number.isInteger(v)) {
															if (v < 1) v = 1;
															if (v > 50) v = 50;
															setTask({
																...task,
																parts_per_instance: v,
															});
														}
													}}
												/>
											</Tooltip>
										</output>
									)}
								/>
								<Textarea
									label="Description"
									value={task.description || ""}
									onChange={(e) =>
										setTask({ ...task, description: e.target.value })
									}
								/>
								<DatePicker
									label="Deadline"
									labelPlacement="outside"
									value={
										task.end_time
											? parseAbsoluteToLocal(task.end_time)
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
										setTask({
											...task,
											end_time: dateWithMidnight.toISOString(),
										});
									}}
								/>
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
									isDisabled={!task.name}
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
