import type { ClientMessage } from "@/lib/types";

// biome-ignore lint/suspicious/noExplicitAny: Vercel AI SDK's conversation type is any
export function ChatMessages({ conversation }: { conversation: any }) {
	return (
		<div className="flex flex-col gap-4">
			{conversation.map((message: ClientMessage) => (
				<div key={message.id}>{message.display}</div>
			))}
		</div>
	);
}
