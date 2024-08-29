"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SendIcon } from "lucide-react";
import type React from "react";
import { forwardRef, useCallback, useEffect, useRef } from "react";

interface ChatInputProps {
	setMessages: React.Dispatch<React.SetStateAction<any[]>>;
	submitUserMessage: (message: string) => void;
	input: string;
	setInput: React.Dispatch<React.SetStateAction<string>>;
	command: string;
	setCommand: React.Dispatch<React.SetStateAction<string>>;
	isPromptPickerOpen: boolean;
	setIsPromptPickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onFocus: () => void;
}

export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
	(
		{
			setMessages,
			submitUserMessage,
			input,
			setInput,
			command,
			setCommand,
			isPromptPickerOpen,
			setIsPromptPickerOpen,
			onFocus,
		},
		ref,
	) => {
		const textareaRef = useRef<HTMLTextAreaElement | null>(null);

		const adjustTextareaHeight = useCallback(() => {
			const textarea = textareaRef.current;
			if (textarea) {
				textarea.style.height = "auto";
				const newHeight = Math.min(Math.max(textarea.scrollHeight, 40), 400);
				textarea.style.height = `${newHeight}px`;

				// Only show scrollbar if content exceeds max height and there's input
				textarea.style.overflowY =
					newHeight === 500 && input.trim() ? "auto" : "hidden";
			}
		}, [input]);

		useEffect(() => {
			adjustTextareaHeight();
		}, [adjustTextareaHeight]);

		const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			const value = e.target.value;
			setInput(value);

			if (value.startsWith("/")) {
				setCommand(value.slice(1));
				setIsPromptPickerOpen(true);
			} else {
				setCommand("");
				setIsPromptPickerOpen(false);
			}
		};

		const handleSubmit = (e: React.FormEvent) => {
			e.preventDefault();
			if (input.trim()) {
				submitUserMessage(input);
				setMessages((messages) => [
					...messages,
					{ role: "user", content: input },
				]);
				setInput("");
				setCommand("");
				setIsPromptPickerOpen(false);
			}
		};

		return (
			<form onSubmit={handleSubmit} className="flex w-full items-end space-x-2">
				<Textarea
					ref={(node) => {
						if (typeof ref === "function") {
							ref(node);
						} else if (ref) {
							ref.current = node;
						}
						textareaRef.current = node;
					}}
					value={input}
					onChange={handleInputChange}
					onFocus={onFocus}
					placeholder="Type a message or use / for commands..."
					rows={1}
					className="min-h-[2.5rem] resize-none py-3.5 pr-10 transition-all duration-300"
					style={{ maxHeight: "500px" }}
					onInput={adjustTextareaHeight}
				/>
				<Button
					type="submit"
					size="icon"
					className={cn(
						"absolute right-2 bottom-2 h-8 w-8 rounded-full",
						!input.trim() && "opacity-50",
					)}
				>
					<SendIcon className="h-4 w-4 bg-transparent" />
				</Button>
			</form>
		);
	},
);

ChatInput.displayName = "ChatInput";
