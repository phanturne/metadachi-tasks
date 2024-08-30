import { resetIntervals } from "@/components/rewards/new-reward-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
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
import { capitalizeWord } from "@/lib/utils";
import type { Tables } from "@/supabase/types";
import { Coins, Package } from "lucide-react";
import { useState } from "react";

interface RewardModalProps {
	isOpen: boolean;
	onClose: () => void;
	reward: Tables<"user_rewards">;
	onDelete: () => void;
	onSave: (reward: Tables<"user_rewards">) => void;
}

export function RewardModal({
	isOpen,
	onClose,
	reward,
	onDelete,
	onSave,
}: RewardModalProps) {
	const [localReward, setLocalReward] = useState(reward);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[550px]">
				<DialogHeader>
					<DialogTitle className="font-semibold text-2xl">
						{localReward.name}
					</DialogTitle>
					<DialogDescription>Edit your reward details below.</DialogDescription>
				</DialogHeader>
				<div className="grid gap-6 py-4">
					<div className="grid gap-2">
						<Label htmlFor="name">Reward Name</Label>
						<Input
							id="name"
							placeholder="Enter reward name"
							value={localReward.name}
							onChange={(e) =>
								setLocalReward({ ...localReward, name: e.target.value })
							}
						/>
					</div>
					<div className="grid grid-cols-3 gap-4">
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
									value={localReward.cost?.toString()}
									onChange={(e) => {
										const v = Number(e.target.value);
										setLocalReward({ ...localReward, cost: v });
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
									value={localReward.quantity?.toString()}
									onChange={(e) => {
										let v = Number(e.target.value);
										if (Number.isInteger(v)) {
											if (v < 1) v = 1;
											const maxQuantity = localReward.max_quantity ?? 999;
											if (v > maxQuantity) v = maxQuantity;
											setLocalReward({ ...localReward, quantity: v });
										}
									}}
									min={1}
									max={localReward.max_quantity ?? 999}
								/>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="mb-2 flex items-center">
									<Package className="mr-2 h-4 w-4" />
									<Label htmlFor="max-quantity">Max Quantity</Label>
								</div>
								<Input
									id="max-quantity"
									type="number"
									value={localReward.max_quantity?.toString()}
									onChange={(e) => {
										let v = Number(e.target.value);
										if (Number.isInteger(v)) {
											if (v < 1) v = 1;
											if (v > 1000000) v = 1000000;
											setLocalReward({ ...localReward, max_quantity: v });
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
							value={localReward.description || ""}
							onChange={(e) =>
								setLocalReward({ ...localReward, description: e.target.value })
							}
							className="h-24"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="reset-interval">Reset Interval</Label>
						<Select
							value={localReward.reset_interval ?? "NEVER"}
							onValueChange={(value) =>
								setLocalReward({ ...localReward, reset_interval: value })
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
					<Button
						variant="destructive"
						onClick={() => {
							onDelete();
							onClose();
						}}
					>
						Delete
					</Button>
					<Button
						onClick={() => {
							onSave(localReward);
							onClose();
						}}
					>
						Save Changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
