import { useAuthModal } from "@/components/providers/auth-context-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createUserReward } from "@/lib/db/rewards";
import { markUserRewardsAsStale } from "@/lib/hooks/use-rewards";
import { useSession } from "@/lib/hooks/use-session";
import { capitalizeWord } from "@/lib/utils";
import type { Tables } from "@/supabase/types";
import { Coins, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EmptyReward: Partial<Tables<"user_rewards">> = {
	name: "",
	quantity: 999,
	max_quantity: 999,
};

export const resetIntervals = ["NEVER", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"];

export function NewRewardButton() {
	const { session } = useSession();
	const { openAuthModal } = useAuthModal();
	const [isOpen, setIsOpen] = useState(false);

	const [reward, setReward] = useState<Partial<Tables<"user_rewards">>>({
		...EmptyReward,
	});

	const handleNewReward = () => {
		if (!session) {
			return openAuthModal();
		}

		setIsOpen(true);
	};

	const handleCreateReward = async () => {
		const rewardData = {
			...reward,
			quantity: reward.max_quantity,
			user_id: session?.user.id,
		} as Tables<"user_rewards">;

		try {
			await createUserReward(rewardData);
			markUserRewardsAsStale(rewardData.user_id);
			setReward(EmptyReward);
			toast.success("Reward created successfully");
		} catch (error) {
			toast.error("Failed to create reward");
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" onClick={handleNewReward}>
					New Reward
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[550px]">
				<DialogHeader>
					<DialogTitle className="font-semibold text-2xl">
						Create New Reward
					</DialogTitle>
					<DialogDescription>
						Design a personalized reward to motivate yourself. Fill in the
						details below.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-6 py-4">
					<div className="grid gap-2">
						<Label htmlFor="name">Reward Name</Label>
						<Input
							id="name"
							placeholder="Enter reward name"
							value={reward.name}
							onChange={(e) => setReward({ ...reward, name: e.target.value })}
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<Card>
							<CardContent className="pt-6">
								<div className="mb-2 flex items-center">
									<Coins className="mr-2 h-4 w-4" />
									<Label htmlFor="price">Price</Label>
								</div>
								<Input
									id="price"
									type="number"
									placeholder="0"
									value={reward.cost?.toString()}
									onChange={(e) => {
										const v = Number(e.target.value);
										setReward({ ...reward, cost: v });
									}}
								/>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="mb-2 flex items-center">
									<Package className="mr-2 h-4 w-4" />
									<Label htmlFor="quantity">Quantity</Label>
								</div>
								<Input
									id="quantity"
									type="number"
									value={reward.max_quantity?.toString()}
									onChange={(e) => {
										let v = Number(e.target.value);
										if (Number.isInteger(v)) {
											if (v < 1) v = 1;
											if (v > 1000000) v = 1000000;
											setReward({ ...reward, max_quantity: v });
										}
									}}
									min={1}
									max={1000000}
								/>
							</CardContent>
						</Card>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="Describe your reward"
							value={reward.description || ""}
							onChange={(e) =>
								setReward({ ...reward, description: e.target.value })
							}
							className="h-24"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="reset-interval">Reset Interval</Label>
						<Select
							value={reward.reset_interval ?? "NEVER"}
							onValueChange={(value) =>
								setReward({ ...reward, reset_interval: value })
							}
						>
							<SelectTrigger id="reset-interval">
								<SelectValue placeholder="Select a reset interval" />
							</SelectTrigger>
							<SelectContent>
								{resetIntervals.map((interval) => (
									<SelectItem key={interval} value={interval}>
										{capitalizeWord(interval)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter className="gap-2 sm:gap-0">
					<Button variant="outline" onClick={() => setIsOpen(false)}>
						Cancel
					</Button>
					<Button
						onClick={() => {
							handleCreateReward();
							setIsOpen(false);
						}}
						disabled={!reward.name}
					>
						Create Reward
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
