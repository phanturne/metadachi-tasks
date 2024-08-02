import type { UIState } from "@/lib/chat/actions";

export function ChatMessages({ messages }: { messages: UIState }) {
	return (
		<div className="flex flex-col gap-4">
			{messages.map((message) => (
				<div key={message.id}>{message.display}</div>
			))}
		</div>
	);
}
