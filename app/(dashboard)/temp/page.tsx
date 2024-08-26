"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Routes } from "@/lib/constants";
import { updateProfile } from "@/lib/db/profile";
import { markProfileAsStale, useProfile } from "@/lib/hooks/use-profile";
import { useSession } from "@/lib/hooks/use-session";
import type { TablesUpdate } from "@/supabase/types";
import { CalendarIcon, Repeat } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STEP_COUNT = 2;

const DatetimePickerHourCycle = () => {
	const [date12, setDate12] = useState<Date | undefined>(undefined);
	const [date24, setDate24] = useState<Date | undefined>(undefined);
	return (
		<div className="flex flex-col gap-3 lg:flex-row">
			<div className="flex flex-col gap-2">
				<Label>12 Hour</Label>
				<DateTimePicker hourCycle={12} value={date12} onChange={setDate12} />
			</div>
			<div className="flex flex-col gap-2">
				<Label>24 Hour</Label>
				<DateTimePicker hourCycle={24} value={date24} onChange={setDate24} />
			</div>
		</div>
	);
};

export default function TempPage() {
	const { session } = useSession();
	const { profile, loading } = useProfile(session?.user.id);

	const router = useRouter();

	const [currentStep, setCurrentStep] = useState(1);
	const [displayName, setDisplayName] = useState("");
	const [username, setUsername] = useState("");
	const [goals, setGoals] = useState<string[]>([]);

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

	return (
		<>
			<DatetimePickerHourCycle />
			<Popover modal={true}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className="w-full justify-start text-left font-normal"
					>
						<Repeat className="mr-2 h-4 w-4" />
						<span>Pick end date</span>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar mode="single" initialFocus />
				</PopoverContent>
			</Popover>
			<Dialog>
				<DialogTrigger asChild>
					<Button variant="outline">New Task</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle className="font-semibold text-2xl">
							Create New Task
						</DialogTitle>
						<DialogDescription>
							Add a new task to your list. Fill in the details below.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-6 py-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Task Name</Label>
							<Input id="name" placeholder="Enter task name" />
						</div>
						<div className="grid gap-2">
							<Label htmlFor="parts">Total Parts</Label>
							<div className="flex items-center gap-4">
								<Slider className="flex-grow" />
								<Input type="number" className="w-16" />
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label>Deadline</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className="w-full justify-start text-left font-normal"
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											<span>Pick a date</span>
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar mode="single" initialFocus />
									</PopoverContent>
								</Popover>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="gold">Gold Reward</Label>
								<Input
									id="gold"
									type="number"
									placeholder="Enter gold amount"
									min="0"
								/>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="recurrence">Repeat</Label>
								<Select>
									<SelectTrigger id="recurrence">
										<SelectValue placeholder="Select recurrence" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="never">Never</SelectItem>
										<SelectItem value="daily">Daily</SelectItem>
										<SelectItem value="weekly">Weekly</SelectItem>
										<SelectItem value="monthly">Monthly</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-2">
								<Label>End Repeat</Label>
								<Popover modal={true}>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className="w-full justify-start text-left font-normal"
										>
											<Repeat className="mr-2 h-4 w-4" />
											<span>Pick end date</span>
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar mode="single" initialFocus />
									</PopoverContent>
								</Popover>
							</div>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								placeholder="Describe your task"
								className="h-24"
							/>
						</div>
					</div>
					<DialogFooter className="gap-2 sm:gap-0">
						<Button variant="outline">Cancel</Button>
						<Button>Create Task</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
