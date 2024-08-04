// Source: https://sdk.vercel.ai/examples/next-app/interface/stream-component-updates
// Source: https://github.com/vercel/ai-chatbot/blob/main/lib/chat/actions.tsx

import "server-only";
import { BotMessage, SpinnerMessage } from "@/components/chat/message";
import { TaskSuggestion } from "@/components/tasks/task-suggestion";
import { TaskDifficultySchema, difficultyGoldMap } from "@/lib/db/constants";
import { skipTask } from "@/lib/db/tasks";
import type { Message } from "@/lib/types";
import type { Tables } from "@/supabase/types";
import { openai } from "@ai-sdk/openai";
import { generateId } from "ai";
import {
	createAI,
	createStreamableValue,
	getMutableAIState,
	streamUI,
} from "ai/rsc";
import { z } from "zod";

export async function submitUserMessage(content: string) {
	"use server";

	const aiState = getMutableAIState<typeof AI>();

	aiState.update({
		...aiState.get(),
		messages: [
			...aiState.get().messages,
			{
				id: generateId(),
				role: "user",
				content,
			},
		],
	});

	let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
	let textNode: undefined | React.ReactNode;

	// @ts-ignore
	const result = await streamUI({
		// model: google("models/gemini-1.5-pro-latest"),
		model: openai("gpt-4o-mini"),
		initial: <SpinnerMessage />,
		system: `\
		You are an AI assistant for a task management app. Your role is to help users manage tasks, create rewards, and set up quests for improved productivity. You can:
		- Create, skip, delete, and update tasks
		- Manage user-defined rewards
		- Create bonus quests
		
		When interacting with users:
		- Be supportive and encourage productivity
		- Provide clear, concise responses
		- Use available tools to perform requested actions
		- Suggest appropriate tasks, rewards, and quests
		- Offer advice on task management and time management
		
		Use markdown for formatting when needed. When using tools, ensure actions align with user requests and promote a positive, motivating experience.`,
		messages: [
			// biome-ignore lint/suspicious/noExplicitAny: From Next.js AI Chatbot example
			...aiState.get().messages.map((message: any) => ({
				role: message.role,
				content: message.content,
			})),
		],
		text: ({ content, done, delta }) => {
			if (!textStream) {
				textStream = createStreamableValue("");
				textNode = <BotMessage content={textStream.value} />;
			}

			if (done) {
				textStream.done();
				aiState.done({
					...aiState.get(),
					messages: [
						...aiState.get().messages,
						{
							id: generateId(),
							role: "assistant",
							content,
						},
					],
				});
			} else {
				textStream.update(delta);
			}

			return textNode;
		},
		tools: {
			CreateTasks: {
				description: "Create multiple new tasks",
				parameters: z.object({
					tasks: z.array(
						z.object({
							taskName: z.string(),
							dueDate: z.string(),
							// taskFrequency: z.string(),
							category: z.string(),
							difficulty: TaskDifficultySchema,
						}),
					),
				}),
				generate: async ({ tasks }) => {
					const newTasks = tasks.map((task) => {
						const difficulty = TaskDifficultySchema.parse(task.difficulty);
						return {
							name: task.taskName,
							end_time: task.dueDate === "" ? undefined : task.dueDate,
							category: task.category,
							difficulty: difficulty,
							gold: difficultyGoldMap[difficulty],
							// recurrence_patterN: task.taskFrequency
						};
					});

					aiState.done({
						...aiState.get(),
						messages: [
							...aiState.get().messages,
							{
								id: generateId(),
								role: "assistant",
								content: `${newTasks.length} tasks have been created.`,
							},
						],
					});

					return (
						<>
							<p className="pb-2">
								Here are {newTasks.length} task suggestions. Click the checkbox
								to add.
							</p>
							<div className="flex flex-col gap-2">
								{newTasks.map((task) => (
									<TaskSuggestion
										key={generateId()}
										task={task as Tables<"tasks">}
									/>
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

					aiState.done({
						...aiState.get(),
						messages: [
							...aiState.get().messages,
							{
								id: generateId(),
								role: "assistant",
								content: `Task with ID ${taskId} has been skipped.`,
							},
						],
					});

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

					aiState.done({
						...aiState.get(),
						messages: [
							...aiState.get().messages,
							{
								id: generateId(),
								role: "assistant",
								content: `Task with ID ${taskId} has been deleted.`,
							},
						],
					});

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

					aiState.done({
						...aiState.get(),
						messages: [
							...aiState.get().messages,
							{
								id: generateId(),
								role: "assistant",
								content: `Task with ID ${taskId} has been updated with progress: ${progress}.`,
							},
						],
					});

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

					aiState.done({
						...aiState.get(),
						messages: [
							...aiState.get().messages,
							{
								id: generateId(),
								role: "assistant",
								content: `Reward "${rewardName}" has been created.`,
							},
						],
					});

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

					aiState.done({
						...aiState.get(),
						messages: [
							...aiState.get().messages,
							{
								id: generateId(),
								role: "assistant",
								content: `Reward with ID ${rewardId} has been deleted.`,
							},
						],
					});

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

					aiState.done({
						...aiState.get(),
						messages: [
							...aiState.get().messages,
							{
								id: generateId(),
								role: "assistant",
								content: `Quest "${questName}" has been created.`,
							},
						],
					});

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

export type AIState = {
	chatId: string;
	messages: Message[];
};

export type UIState = {
	id: string;
	display: React.ReactNode;
}[];

export const AI = createAI<AIState, UIState>({
	actions: {
		submitUserMessage,
	},
	initialUIState: [],
	initialAIState: { chatId: generateId(), messages: [] },
	// onGetUIState: async () => {
	// 	'use server'
	//
	// 	const session = await auth()
	//
	// 	if (session && session.user) {
	// 		const aiState = getAIState() as Chat
	//
	// 		if (aiState) {
	// 			const uiState = getUIStateFromAIState(aiState)
	// 			return uiState
	// 		}
	// 	} else {
	// 		return
	// 	}
	// },
	// onSetAIState: async ({ state }) => {
	// 	'use server'
	//
	// 	const session = await auth()
	//
	// 	if (session && session.user) {
	// 		const { chatId, messages } = state
	//
	// 		const createdAt = new Date()
	// 		const userId = session.user.id as string
	// 		const path = `/chat/${chatId}`
	//
	// 		const firstMessageContent = messages[0].content as string
	// 		const title = firstMessageContent.substring(0, 100)
	//
	// 		const chat: Chat = {
	// 			id: chatId,
	// 			title,
	// 			userId,
	// 			createdAt,
	// 			messages,
	// 			path
	// 		}
	//
	// 		await saveChat(chat)
	// 	} else {
	// 		return
	// 	}
	// }
});
