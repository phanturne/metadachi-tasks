// Source: https://sdk.vercel.ai/examples/next-app/interface/stream-component-updates
// 				 https://github.com/vercel/ai-chatbot/blob/main/lib/types.ts#L7

import type { CoreMessage } from "ai";
import type { ReactNode } from "react";

export type Message = CoreMessage & {
	id: string;
};

export interface Chat extends Record<string, any> {
	id: string;
	title: string;
	createdAt: Date;
	userId: string;
	path: string;
	messages: Message[];
	sharePath?: string;
}

export interface ServerMessage {
	role: "user" | "assistant";
	content: string;
}

export interface ClientMessage {
	id: string;
	role: "user" | "assistant";
	display: ReactNode;
}
