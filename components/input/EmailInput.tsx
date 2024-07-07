import { Icon } from "@iconify/react";
import { Input } from "@nextui-org/react";
import React from "react";

export default function EmailInput({ hasError: isInvalid = false }) {
	return (
		<Input
			name="email"
			type="email"
			placeholder="Email"
			isRequired
			isInvalid={isInvalid}
			startContent={
				<Icon icon="solar:letter-bold-duotone" className="text-xl" />
			}
		/>
	);
}
