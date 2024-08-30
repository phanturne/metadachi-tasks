import { Loader2 } from "lucide-react";

export default function Loading() {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<Loader2 className="h-8 w-8 animate-spin text-primary" />
			<span className="sr-only">Loading</span>
		</div>
	);
}
