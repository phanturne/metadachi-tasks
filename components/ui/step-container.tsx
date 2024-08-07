// Source: https://github.com/phanturne/metadachi/blob/main/app/components/ui/StepContainer.tsx
//         https://github.com/mckaywrigley/chatbot-ui/blob/main/components/setup/step-container.tsx

import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
} from "@nextui-org/react";
import type { FC } from "react";

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
		<Card className="max-h-full w-[500px] p-4">
			<CardHeader className="flex flex-col items-start gap-2">
				<div className="flex w-full justify-between">
					<h1 className="text-2xl font-semibold">{stepTitle}</h1>
					<p>{`${stepNum} / ${stepCount}`}</p>
				</div>
				<p>{stepDescription}</p>
			</CardHeader>
			<CardBody className="overflow-y-scroll">{children}</CardBody>
			<CardFooter className="flex justify-between">
				<div>
					{showBackButton && (
						<Button onClick={() => onShouldProceed(false)}>Back</Button>
					)}
				</div>

				{showNextButton && (
					<Button color="primary" onClick={() => onShouldProceed(true)}>
						Next
					</Button>
				)}
			</CardFooter>
		</Card>
	);
};
