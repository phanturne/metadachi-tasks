// Sources: https://sdk.vercel.ai/examples/next-app/interface/stream-component-updates
//          https://github.com/mckaywrigley/chatbot-ui/blob/main/components/chat/chat-ui.tsx

"use client";

import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/messages";
import { NewChatContent } from "@/components/chat/new-chat-content";
import {
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	ScrollShadow,
} from "@nextui-org/react";
import { useActions, useUIState } from "ai/rsc";
import React from "react";

export function Chat() {
	const [conversation, setConversation] = useUIState();
	const { submitUserMessage } = useActions();

	const isNewChat = conversation.length === 0;

	return (
		<Card className="px-4 rounded-lg w-full flex flex-col">
			<CardHeader className="flex justify-between">
				<h1 className="text-xl bold">AI Chat</h1>
			</CardHeader>
			<CardBody>
				<ScrollShadow className="flex h-full flex-col overflow-y-scroll">
					{isNewChat ? (
						<NewChatContent />
					) : (
						<ChatMessages conversation={conversation} />
					)}
				</ScrollShadow>
			</CardBody>
			<CardFooter>
				<div className="relative flex w-full flex-col gap-4">
					<ChatInput
						setConversation={setConversation}
						submitUserMessage={submitUserMessage}
					/>
				</div>
			</CardFooter>
		</Card>
	);
}
