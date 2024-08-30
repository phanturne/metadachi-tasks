"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import { useEffect } from "react";

interface PromptVariableModalProps {
	showPromptVariables: boolean;
	setShowPromptVariables: (showPromptVariables: boolean) => void;
	promptVariables: {
		promptId: string;
		name: string;
		value: string;
	}[];
	setPromptVariables: (
		promptVariables: {
			promptId: string;
			name: string;
			value: string;
		}[],
	) => void;
	handleSubmitPromptVariables: () => void;
}

export function PromptVariableModal({
	showPromptVariables,
	setShowPromptVariables,
	promptVariables,
	setPromptVariables,
	handleSubmitPromptVariables,
}: PromptVariableModalProps) {
	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleSubmitPromptVariables();
	};

	// Create a ref for each textarea
	const textAreaRefs = promptVariables.map(() =>
		React.createRef<HTMLTextAreaElement>(),
	);

	// Focus on the first textarea when the modal opens
	useEffect(() => {
		if (showPromptVariables && textAreaRefs[0].current) {
			textAreaRefs[0].current.focus();
		}
	}, [showPromptVariables, textAreaRefs]);

	return (
		<Dialog open={showPromptVariables} onOpenChange={setShowPromptVariables}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Enter Prompt Variables</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleFormSubmit}>
					<div className="grid gap-4 py-4">
						{promptVariables.map((variable, index) => (
							<div key={`prompt-var-${variable.name}`} className="grid gap-2">
								<label
									htmlFor={`prompt-var-${variable.name}`}
									className="font-medium text-sm"
								>
									{variable.name}
								</label>
								<Textarea
									id={`prompt-var-${variable.name}`}
									placeholder={`Enter a value for ${variable.name}...`}
									value={variable.value}
									onChange={(e) => {
										const newPromptVariables = [...promptVariables];
										newPromptVariables[index].value = e.target.value;
										setPromptVariables(newPromptVariables);
									}}
									rows={2}
									ref={textAreaRefs[index]}
								/>
							</div>
						))}
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setShowPromptVariables(false)}
						>
							Cancel
						</Button>
						<Button type="submit">Submit</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
