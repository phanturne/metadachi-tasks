"use client";

import { PromptPicker } from "@/components/chat/prompt-picker";
import { Card } from "@/components/ui/card";

interface ChatCommandsProps {
	command: string;
	isPromptPickerOpen: boolean;
	setIsPromptPickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onPromptSelect: (promptContent: string) => void;
}

export function ChatCommands({
	command,
	isPromptPickerOpen,
	setIsPromptPickerOpen,
	onPromptSelect,
}: ChatCommandsProps) {
	if (!isPromptPickerOpen) {
		return null;
	}

	return (
		<Card className="absolute right-0 bottom-full left-0 mb-2 max-h-[400px] overflow-hidden rounded-lg border shadow-lg">
			<PromptPicker
				command={command}
				isPromptPickerOpen={isPromptPickerOpen}
				setIsPromptPickerOpen={setIsPromptPickerOpen}
				onPromptSelect={onPromptSelect}
			/>
		</Card>
	);
}
