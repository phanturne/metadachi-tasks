import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Lock } from "lucide-react";
import React from "react";

export default function PasswordInput({
	value,
	onValueChange,
	name = "password",
	label = "Password",
	placeholder = "Password",
	isInvalid = false,
	errorMessage,
}: {
	value?: string;
	onValueChange?: React.Dispatch<React.SetStateAction<string>>;
	name?: string;
	label?: string;
	placeholder?: string;
	isInvalid?: boolean;
	errorMessage?: string;
}) {
	const [isVisible, setIsVisible] = React.useState(false);
	const toggleVisibility = () => setIsVisible(!isVisible);

	return (
		<div className="space-y-2">
			<Label htmlFor={name} className="font-medium text-sm">
				{label}
			</Label>
			<div className="relative">
				<Input
					id={name}
					value={value}
					onChange={(e) => onValueChange?.(e.target.value)}
					name={name}
					type={isVisible ? "text" : "password"}
					placeholder={placeholder}
					className={cn(
						"pr-10 pl-10",
						isInvalid && "border-red-600 focus:border-red-600",
					)}
					aria-invalid={isInvalid}
				/>
				<div className="absolute inset-y-0 left-0 flex items-center pl-3">
					<Lock className="text-gray-500" />
				</div>
				<div className="absolute inset-y-0 right-0 flex items-center pr-3">
					<button
						className="flex focus:outline-none"
						type="button"
						onClick={toggleVisibility}
					>
						{isVisible ? (
							<EyeOff className="text-gray-500" />
						) : (
							<Eye className="text-gray-500" />
						)}
					</button>
				</div>
			</div>
			{isInvalid && errorMessage && (
				<p className="text-red-600 text-sm">{errorMessage}</p>
			)}
		</div>
	);
}
