import { GoalOption } from "@/components/setup/goal-option";
import { StepContainer } from "@/components/ui/step-container";
import React, { type FC } from "react";

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
			showNextButton={!!goals.length}
			showBackButton={true}
		>
			<div className="flex flex-col space-y-2">
				{[
					"Improve time management",
					"Build better habits",
					"Increase focus and concentration",
					"Reduce procrastination",
					"Achieve work-life balance",
					"Other",
				].map((goal) => (
					<GoalOption
						key={goal}
						value={goal}
						checked={goals.includes(goal)}
						onCheckedChange={(checked) => {
							if (checked) {
								onGoalsChange([...goals, goal]);
							} else {
								onGoalsChange(goals.filter((g) => g !== goal));
							}
						}}
					/>
				))}
			</div>
		</StepContainer>
	);
};
