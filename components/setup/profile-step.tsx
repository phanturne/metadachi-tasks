// Source: https://github.com/mckaywrigley/chatbot-ui/blob/main/components/setup/profile-step.tsx

import {
	DisplayNameInput,
	UsernameInput,
} from "@/components/input/ProfileInputs";
import { StepContainer } from "@/components/ui/step-container";
import type { FC } from "react";
import { useState } from "react";

interface ProfileStepProps {
	stepCount: number;
	currentStep: number;
	handleShouldProceed: (_: boolean) => void;
	username: string;
	displayName: string;
	onUsernameChange: (username: string) => void;
	onDisplayNameChange: (name: string) => void;
}

export const ProfileStep: FC<ProfileStepProps> = ({
	stepCount,
	currentStep,
	handleShouldProceed,
	username,
	displayName,
	onUsernameChange,
	onDisplayNameChange,
}) => {
	const [usernameAvailable, setUsernameAvailable] = useState(true);

	return (
		<StepContainer
			stepCount={stepCount}
			stepNum={currentStep}
			stepTitle="Welcome to Metadachi Tasks!"
			stepDescription="Let's get you set up for success in just a few quick steps."
			onShouldProceed={handleShouldProceed}
			showNextButton={!!(username && usernameAvailable) && !!displayName}
			showBackButton={false}
		>
			<div className="flex flex-col gap-4">
				<UsernameInput
					username={username}
					usernameAvailable={usernameAvailable}
					onUsernameAvailableChange={setUsernameAvailable}
					onUsernameChange={onUsernameChange}
				/>

				<DisplayNameInput
					displayName={displayName}
					onDisplayNameChange={onDisplayNameChange}
				/>
			</div>
		</StepContainer>
	);
};
