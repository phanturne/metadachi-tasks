// Source: https://github.com/phanturne/metadachi/blob/main/app/components/ui/StepContainer.tsx
//         https://github.com/mckaywrigley/chatbot-ui/blob/main/components/setup/step-container.tsx

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import type { FC } from "react";
import type React from "react";

interface StepContainerProps {
	stepCount: number;
	stepDescription: string;
	stepNum: number;
	stepTitle: string;
	onShouldProceed: (shouldProceed: boolean) => void;
	children?: React.ReactNode;
	showBackButton?: boolean;
	showNextButton?: boolean;
}

export const StepContainer: FC<StepContainerProps> = ({
	stepCount,
	stepDescription,
	stepNum,
	stepTitle,
	onShouldProceed,
	children,
	showBackButton = false,
	showNextButton = true,
}) => {
	return (
		<Card className="max-h-full w-[500px] bg-gradient-to-br from-slate-100 to-slate-200 p-4 dark:from-slate-800 dark:to-slate-900">
			<CardHeader className="flex flex-col items-start gap-2">
				<div className="flex w-full justify-between">
					<h1 className="font-semibold text-2xl">{stepTitle}</h1>
					<p>{`${stepNum} / ${stepCount}`}</p>
				</div>
				<p>{stepDescription}</p>
			</CardHeader>
			<CardContent className="overflow-y-auto">{children}</CardContent>
			<CardFooter className="flex justify-between">
				<div>
					{showBackButton && (
						<Button variant="outline" onClick={() => onShouldProceed(false)}>
							Back
						</Button>
					)}
				</div>
				{showNextButton && (
					<Button onClick={() => onShouldProceed(true)}>Next</Button>
				)}
			</CardFooter>
		</Card>
	);
};
