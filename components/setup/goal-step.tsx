import { GoalOption } from "@/components/setup/goal-option";
import { StepContainer } from "@/components/ui/step-container";
import { CheckboxGroup } from "@nextui-org/react";
import type { FC } from "react";

interface GoalStepProps {
	stepCount: number;
	currentStep: number;
	handleShouldProceed: (_: boolean) => void;
	goals: string[];
	onGoalsChange: (goals: string[]) => void;
}

export const GoalStep: FC<GoalStepProps> = ({
	stepCount,
	currentStep,
	handleShouldProceed,
	goals,
	onGoalsChange,
}) => {
	return (
		<StepContainer
			stepCount={stepCount}
			stepNum={currentStep}
			stepTitle="What's your main focus?"
			stepDescription="Select your top productivity goals."
			onShouldProceed={handleShouldProceed}
			showNextButton={!!goals}
			showBackButton={true}
		>
			<CheckboxGroup
				label="Select your goals"
				value={goals}
				onChange={onGoalsChange}
				classNames={{
					base: "w-full",
				}}
			>
				<GoalOption value="Improve time management" />
				<GoalOption value="Build better habits" />
				<GoalOption value="Increase focus and concentration" />
				<GoalOption value="Reduce procrastination" />
				<GoalOption value="Achieve work-life balance" />
				<GoalOption value="Other" />
			</CheckboxGroup>
		</StepContainer>
	);
};
