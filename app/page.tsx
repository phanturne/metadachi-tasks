import { Chat } from "@/components/chat";
import { AI } from "@/lib/chat/actions";

export default function HomePage() {
	return (
		<AI>
			<Chat />
		</AI>
	);
}
