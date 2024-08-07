"use client";

import { GoalStep } from "@/components/setup/goal-step";
import { ProfileStep } from "@/components/setup/profile-step";
import { Routes } from "@/lib/constants";
import { updateProfile } from "@/lib/db/profile";
import { markProfileAsStale, useProfile } from "@/lib/hooks/use-profile";
import { useSession } from "@/lib/hooks/use-session";
import type { TablesUpdate } from "@/supabase/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STEP_COUNT = 2;

export default function SetupPage() {
	const { session } = useSession();
	const { profile, loading } = useProfile(session?.user.id);

	const router = useRouter();

	const [currentStep, setCurrentStep] = useState(1);
	const [displayName, setDisplayName] = useState("");
	const [username, setUsername] = useState("");
	const [goals, setGoals] = useState<string[]>([]);

	useEffect(() => {
		if (!loading) {
			if (!profile) {
				router.push(Routes.Login);
			} else if (profile.has_onboarded) {
				router.push(Routes.Home);
			} else {
				setUsername(profile.username || "");
				setDisplayName(profile.display_name || "");
				setGoals(profile.goals || []);
			}
		}
	}, [loading, profile, router]);

	const handleShouldProceed = (proceed: boolean) => {
		if (proceed) {
			if (currentStep === STEP_COUNT) {
				handleSaveSetupSetting();
			} else {
				setCurrentStep(currentStep + 1);
			}
		} else {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleSaveSetupSetting = async () => {
		if (!profile) {
			return router.push(Routes.Login);
		}

		const updateProfilePayload: TablesUpdate<"profiles"> = {
			...profile,
			has_onboarded: true,
			display_name: displayName,
			username,
			goals,
		};

		await updateProfile(profile.id, updateProfilePayload);
		markProfileAsStale(profile.id);

		return router.push(Routes.Home);
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!profile || profile.has_onboarded) {
		return null;
	}

	return (
		<div className="flex h-dvh w-dvw items-center justify-center">
			{currentStep === 1 && (
				<ProfileStep
					stepCount={STEP_COUNT}
					currentStep={currentStep}
					handleShouldProceed={handleShouldProceed}
					username={username}
					displayName={displayName}
					onUsernameChange={setUsername}
					onDisplayNameChange={setDisplayName}
				/>
			)}
			{currentStep === 2 && (
				<GoalStep
					stepCount={STEP_COUNT}
					currentStep={currentStep}
					handleShouldProceed={handleShouldProceed}
					goals={goals}
					onGoalsChange={setGoals}
				/>
			)}
		</div>
	);
}
