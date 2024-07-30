// Sources: https://www.nextui.pro/components/ai/prompt-inputs#component-prompt-input-with-suggestions-above
//          https://sdk.vercel.ai/examples/next-app/interface/stream-component-updates
//          https://github.com/mckaywrigley/chatbot-ui/blob/main/components/chat/chat-input.tsx

"use client";

import type { ClientMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import type { TextAreaProps } from "@nextui-org/react";
import { Button, Textarea } from "@nextui-org/react";
import { generateId } from "ai";
import React, { useState } from "react";

interface ChatInputProps extends TextAreaProps {
	setConversation: React.Dispatch<React.SetStateAction<ClientMessage[]>>;
	submitUserMessage: (message: string) => Promise<ClientMessage>;
}

export const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
	({ classNames = {}, setConversation, submitUserMessage, ...props }, ref) => {
		const [input, setInput] = useState<string>("");
		const [isComposing, setIsComposing] = useState<boolean>(false);

		const handleInputChange = (value: string) => {
			setInput(value);
		};

		const handleSendMessage = async () => {
			if (!input.trim()) return;

			setConversation((currentConversation) => [
				...currentConversation,
				{ id: generateId(), role: "user", display: input },
			]);

			setInput(""); // Clear the input field immediately (value is captured in the closure of this function)

			const message = await submitUserMessage(input);

			setConversation((currentConversation) => [
				...currentConversation,
				message,
			]);
		};

		const handleKeyDown = (event: React.KeyboardEvent) => {
			if (event.key === "Enter" && !event.shiftKey && !isComposing) {
				event.preventDefault();
				handleSendMessage();
			}
		};

		return (
			<Textarea
				ref={ref}
				aria-label="Chat Input"
				// className="min-h-[40px]"
				classNames={{
					...classNames,
					label: cn("hidden", classNames?.label),
					input: cn("py-0", classNames?.input),
					inputWrapper: "!bg-transparent shadow-none items-center",
					innerWrapper: "relative items-center",
				}}
				minRows={1}
				placeholder="Ask anything..."
				radius="lg"
				variant="bordered"
				value={input}
				onValueChange={handleInputChange}
				onCompositionStart={() => setIsComposing(true)}
				onCompositionEnd={() => setIsComposing(false)}
				onKeyDown={handleKeyDown}
				endContent={
					<div className="flex gap-2">
						<Button
							isIconOnly
							color={!input.trim() ? "default" : "primary"}
							radius="full"
							variant={!input.trim() ? "flat" : "solid"}
							onClick={handleSendMessage}
						>
							<Icon
								className={cn(
									"[&>path]:stroke-[2px]",
									!input.trim()
										? "text-default-500"
										: "text-primary-foreground",
								)}
								icon="solar:arrow-up-linear"
								width={20}
							/>
						</Button>
					</div>
				}
				{...props}
			/>
		);
	},
);

ChatInput.displayName = "ChatInput";
