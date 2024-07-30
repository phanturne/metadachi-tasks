// Source: https://sdk.vercel.ai/examples/next-app/interface/stream-component-updates

import "server-only";
import { TaskSuggestion } from "@/components/tasks/task-suggestion";
import { skipTask } from "@/lib/db/tasks";
import type { ClientMessage, ServerMessage } from "@/lib/types";
import type { Tables } from "@/supabase/types";
import { openai } from "@ai-sdk/openai";
import { generateId } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { z } from "zod";

export async function submitUserMessage(input: string): Promise<ClientMessage> {
	"use server";

	const history = getMutableAIState();

	// @ts-ignore
	const result = await streamUI({
		model: openai("gpt-4o-mini"),
		messages: [...history.get(), { role: "user", content: input }],
		text: ({ content, done }) => {
			if (done) {
				history.done((messages: ServerMessage[]) => [
					...messages,
					{ role: "assistant", content },
				]);
			}

			return <div>{content}</div>;
		},
		tools: {
			CreateTasks: {
				description: "Create multiple new tasks",
				parameters: z.object({
					tasks: z.array(
						z.object({
							taskName: z.string(),
							dueDate: z.string(),
							taskFrequency: z.string(),
							category: z.string(),
							difficulty: z.string(),
							goldReward: z.number(),
						}),
					),
				}),
				generate: async ({ tasks }) => {
					const newTasks: Partial<Tables<"tasks">>[] = tasks.map((task) => ({
						name: task.taskName,
						end_time: task.dueDate,
						recurrence_pattern: task.taskFrequency,
						category: task.category,
						difficulty: task.difficulty,
						gold: task.goldReward,
					}));

					history.done((messages: ServerMessage[]) => [
						...messages,
						{
							role: "assistant",
							content: `${newTasks.length} tasks have been created.`,
						},
					]);

					return (
						<>
							<p className="pb-2">
								Here are {newTasks.length} task suggestions. Click the checkbox
								to add.
							</p>
							<div className="flex flex-col gap-2">
								{newTasks.map((task) => (
									<TaskSuggestion key={generateId()} task={task} />
								))}
							</div>
						</>
					);
				},
			},
			SkipTask: {
				description: "Skip one of the user's tasks",
				parameters: z.object({
					taskId: z.number(),
				}),
				generate: async ({ taskId }) => {
					// Implement the API call to skip a task here
					await skipTask(taskId); // Replace with actual function

					history.done((messages: ServerMessage[]) => [
						...messages,
						{
							role: "assistant",
							content: `Task with ID ${taskId} has been skipped.`,
						},
					]);

					return <div>Task with ID {taskId} skipped.</div>;
				},
			},
			DeleteTask: {
				description: "Delete one of the user's tasks",
				parameters: z.object({
					taskId: z.number(),
				}),
				generate: async ({ taskId }) => {
					// Implement the API call to delete a task here
					// await deleteTask(taskId); // Replace with actual function

					history.done((messages: ServerMessage[]) => [
						...messages,
						{
							role: "assistant",
							content: `Task with ID ${taskId} has been deleted.`,
						},
					]);

					return <div>Task with ID {taskId} deleted.</div>;
				},
			},
			UpdateTask: {
				description: "Update a task based on the user's progress",
				parameters: z.object({
					taskId: z.number(),
					progress: z.string(),
				}),
				generate: async ({ taskId, progress }) => {
					// Implement the API call to update a task here
					// await updateTask(taskId, progress); // Replace with actual function

					history.done((messages: ServerMessage[]) => [
						...messages,
						{
							role: "assistant",
							content: `Task with ID ${taskId} has been updated with progress: ${progress}.`,
						},
					]);

					return (
						<div>
							Task with ID {taskId} updated with progress: {progress}.
						</div>
					);
				},
			},
			CreateReward: {
				description: "Create a new user-defined reward",
				parameters: z.object({
					rewardName: z.string(),
				}),
				generate: async ({ rewardName }) => {
					// Implement the API call to create a reward here
					// await createReward(rewardName); // Replace with actual function

					history.done((messages: ServerMessage[]) => [
						...messages,
						{
							role: "assistant",
							content: `Reward "${rewardName}" has been created.`,
						},
					]);

					return <div>Reward "{rewardName}" created successfully!</div>;
				},
			},
			DeleteReward: {
				description: "Remove a user-defined reward",
				parameters: z.object({
					rewardId: z.number(),
				}),
				generate: async ({ rewardId }) => {
					// Implement the API call to delete a reward here
					// await deleteReward(rewardId); // Replace with actual function

					history.done((messages: ServerMessage[]) => [
						...messages,
						{
							role: "assistant",
							content: `Reward with ID ${rewardId} has been deleted.`,
						},
					]);

					return <div>Reward with ID {rewardId} deleted.</div>;
				},
			},
			CreateQuest: {
				description:
					"Create a bonus quest to incentivize the user to complete their tasks",
				parameters: z.object({
					questName: z.string(),
				}),
				generate: async ({ questName }) => {
					// Implement the API call to create a quest here
					// await createQuest(questName); // Replace with actual function

					history.done((messages: ServerMessage[]) => [
						...messages,
						{
							role: "assistant",
							content: `Quest "${questName}" has been created.`,
						},
					]);

					return <div>Quest "{questName}" created successfully!</div>;
				},
			},
		},
	});

	return {
		id: generateId(),
		role: "assistant",
		display: result.value,
	};
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
	actions: {
		submitUserMessage,
	},
	initialAIState: [],
	initialUIState: [],
});
