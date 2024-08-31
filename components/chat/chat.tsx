"use client";

import { ChatCommands } from "@/components/chat/chat-commands";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/messages";
import { NewChatContent } from "@/components/chat/new-chat-content";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useActions, useUIState } from "ai/rsc";
import { useEffect, useRef, useState } from "react";

export function Chat() {
	const [messages, setMessages] = useUIState();
	const { submitUserMessage } = useActions();
	const [isPromptPickerOpen, setIsPromptPickerOpen] = useState(false);
	const [input, setInput] = useState("");
	const [command, setCommand] = useState("");
	const chatInputRef = useRef<HTMLTextAreaElement>(null);
	const chatCommandsRef = useRef<HTMLDivElement>(null);

	const isNewChat = messages.length === 0;

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				chatInputRef.current &&
				chatCommandsRef.current &&
				!chatInputRef.current.contains(event.target as Node) &&
				!chatCommandsRef.current.contains(event.target as Node) &&
				isPromptPickerOpen
			) {
				setIsPromptPickerOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isPromptPickerOpen]);

	const handleInputFocus = () => {
		if (!isPromptPickerOpen && input.startsWith("/")) {
			setIsPromptPickerOpen(true);
		}
	};

	const handlePromptSelect = (promptContent: string) => {
		setInput(promptContent);
		setCommand("");
		setIsPromptPickerOpen(false);

		// Focus the chat input
		if (chatInputRef.current) {
			chatInputRef.current.focus();
		}
	};

	return (
		<Card className="flex h-full w-full flex-col bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
			<CardContent className="flex-grow overflow-hidden p-0">
				{isNewChat ? (
					<div className="flex h-full items-center justify-center">
						<NewChatContent />
					</div>
				) : (
					<ScrollArea className="h-full p-4">
						<ChatMessages messages={messages} />
					</ScrollArea>
				)}
			</CardContent>
			<CardFooter className="p-4">
				<div className="relative w-full">
					<ChatInput
						ref={chatInputRef}
						setMessages={setMessages}
						submitUserMessage={submitUserMessage}
						input={input}
						setInput={setInput}
						command={command}
						setCommand={setCommand}
						isPromptPickerOpen={isPromptPickerOpen}
						setIsPromptPickerOpen={setIsPromptPickerOpen}
						onFocus={handleInputFocus}
					/>
					<div ref={chatCommandsRef}>
						<ChatCommands
							command={command}
							isPromptPickerOpen={isPromptPickerOpen}
							setIsPromptPickerOpen={setIsPromptPickerOpen}
							onPromptSelect={handlePromptSelect}
						/>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}
