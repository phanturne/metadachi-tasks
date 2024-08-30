import { Input } from "@/components/ui/input"; // Assuming you're using the ShadCN UI components
import { Mail } from "lucide-react";
import React from "react";

export default function EmailInput({ hasError: isInvalid = false }) {
	return (
		<div className="relative flex items-center">
			<Mail className="absolute left-3 text-gray-500 text-xl" />
			<Input
				name="email"
				type="email"
				placeholder="Email"
				required
				className={`pl-10 ${isInvalid ? "border-red-500" : ""}`}
			/>
		</div>
	);
}
