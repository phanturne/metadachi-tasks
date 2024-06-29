// Source: https://sdk.vercel.ai/examples/next-app/interface/stream-component-updates

import type { ReactNode } from "react";

export interface ServerMessage {
	role: "user" | "assistant";
	content: string;
}

export interface ClientMessage {
	id: string;
	role: "user" | "assistant";
	display: ReactNode;
}
