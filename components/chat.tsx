// Source: https://sdk.vercel.ai/examples/next-app/interface/stream-component-updates

"use client";

import type { ClientMessage } from "@/lib/types";
import { generateId } from "ai";
import { useActions, useUIState } from "ai/rsc";
import { useState } from "react";

export function Chat() {
	const [input, setInput] = useState<string>("");
	const [conversation, setConversation] = useUIState();
	const { submitUserMessage } = useActions();

	return (
		<>
			<div>
				{conversation.map((message: ClientMessage) => (
					<div key={message.id}>
						{message.role}: {message.display}
					</div>
				))}
			</div>

			<div>
				<input
					type="text"
					value={input}
					onChange={(event) => {
						setInput(event.target.value);
					}}
				/>
				<button
					type="button"
					onClick={async () => {
						setConversation((currentConversation: ClientMessage[]) => [
							...currentConversation,
							{ id: generateId(), role: "user", display: input },
						]);

						const message = await submitUserMessage(input);

						setConversation((currentConversation: ClientMessage[]) => [
							...currentConversation,
							message,
						]);
					}}
				>
					Send Message
				</button>
			</div>
		</>
	);
}
