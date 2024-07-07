import { Icon } from "@iconify/react";
import { Input } from "@nextui-org/react";
import React from "react";

export default function PasswordInput({
	value,
	onValueChange,
	name = "password",
	label = "Password",
	labelPlacement = "inside",
	placeholder = "Password",
	variant,
	color = "default",
	isInvalid = false,
	errorMessage,
}: {
	value?: string;
	onValueChange?: React.Dispatch<React.SetStateAction<string>>;
	name?: string;
	label?: string;
	labelPlacement?: "outside" | "inside";
	placeholder?: string;
	variant?: "bordered" | "flat";
	color?:
		| "default"
		| "primary"
		| "secondary"
		| "success"
		| "warning"
		| "danger"
		| undefined;
	isInvalid?: boolean;
	errorMessage?: string;
}) {
	const [isVisible, setIsVisible] = React.useState(false);
	const toggleVisibility = () => setIsVisible(!isVisible);

	return (
		<Input
			value={value}
			onValueChange={onValueChange}
			name={name}
			type={isVisible ? "text" : "password"}
			label={label}
			labelPlacement={labelPlacement}
			placeholder={placeholder}
			isRequired
			variant={variant}
			color={color}
			isInvalid={isInvalid}
			errorMessage={errorMessage}
			startContent={
				<Icon icon="solar:lock-password-bold-duotone" className="text-xl" />
			}
			endContent={
				<button
					className="flex focus:outline-none"
					type="button"
					onClick={toggleVisibility}
				>
					{isVisible ? (
						<Icon icon="solar:eye-closed-bold-duotone" className="text-xl" />
					) : (
						<Icon icon="solar:eye-bold-duotone" className="text-xl" />
					)}
				</button>
			}
		/>
	);
}
