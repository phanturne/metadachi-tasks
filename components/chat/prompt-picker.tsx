// Source: https://github.com/mckaywrigley/chatbot-ui/blob/main/components/chat/prompt-picker.tsx

import { type Prompt, prompts } from "@/components/chat/prompts";
import { usePickerKeyHandler } from "@/components/chat/use-picker-key-handler";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";

interface PromptPickerProps {
	command: string;
	isPromptPickerOpen: boolean;
	setIsPromptPickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onPromptSelect: (promptContent: string) => void;
}

export function PromptPicker({
	command,
	isPromptPickerOpen,
	setIsPromptPickerOpen,
	onPromptSelect,
}: PromptPickerProps) {
	const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>(prompts);
	const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		setFilteredPrompts(
			prompts.filter((prompt) =>
				prompt.name.toLowerCase().includes(command.toLowerCase()),
			),
		);
	}, [command]);

	const handleItemSelect = (prompt: Prompt) => {
		onPromptSelect(prompt.content);
	};

	const getKeyDownHandler = usePickerKeyHandler({
		itemsRef,
		filteredItems: filteredPrompts,
		handleItemSelect: handleItemSelect,
		handleOpenChange: () => setIsPromptPickerOpen(false),
	});

	if (!isPromptPickerOpen) return null;

	return (
		<ScrollArea className="h-[300px]">
			<div className="p-2">
				{filteredPrompts.length === 0 ? (
					<div className="flex h-14 items-center justify-center text-muted-foreground text-sm italic">
						No matching prompts found.
					</div>
				) : (
					filteredPrompts.map((prompt, index) => (
						<div
							key={prompt.id}
							ref={(el) => {
								itemsRef.current[index] = el;
							}}
							className="flex cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-accent focus:bg-accent focus:outline-none"
							onClick={() => handleItemSelect(prompt)}
							onKeyDown={() => getKeyDownHandler(index)}
							tabIndex={0}
							role="button"
						>
							<span className="text-2xl">{prompt.emoji}</span>
							<div>
								<p className="font-medium">{prompt.name}</p>
								<p className="text-muted-foreground text-sm">
									{prompt.content}
								</p>
							</div>
						</div>
					))
				)}
			</div>
		</ScrollArea>
	);
}
