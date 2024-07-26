import type { ClientMessage } from "@/lib/types";

// biome-ignore lint/suspicious/noExplicitAny: Vercel AI SDK's conversation type is any
export function ChatMessages({ conversation }: { conversation: any }) {
	return (
		<>
			{conversation.map((message: ClientMessage) => (
				<div key={message.id}>
					{message.role}: {message.display}
				</div>
			))}
		</>
	);
}
