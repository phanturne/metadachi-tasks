// Source: https://sdk.vercel.ai/examples/next-app/interface/stream-component-updates

import "server-only";
import type { ClientMessage, ServerMessage } from "@/lib/types";
import { openai } from "@ai-sdk/openai";
import { generateId } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";

export async function submitUserMessage(input: string): Promise<ClientMessage> {
	"use server";

	const history = getMutableAIState();

	const result = await streamUI({
		model: openai("gpt-3.5-turbo"),
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
		tools: {},
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
