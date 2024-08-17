import { useAuthModal } from "@/components/providers/auth-context-provider";
import { createUserReward } from "@/lib/db/rewards";
import { markUserRewardsAsStale } from "@/lib/hooks/use-rewards";
import { useSession } from "@/lib/hooks/use-session";
import { capitalizeWord } from "@/lib/utils";
import type { Tables } from "@/supabase/types";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	Textarea,
	useDisclosure,
} from "@nextui-org/react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

const EmptyReward: Partial<Tables<"user_rewards">> = {
	name: "",
	quantity: 999,
	max_quantity: 999,
};

export const NewRewardButton = () => {
	const { session } = useSession();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const { openAuthModal } = useAuthModal();

	const [reward, setReward] = useState<Partial<Tables<"user_rewards">>>({
		...EmptyReward,
	});

	const handleNewReward = () => {
		if (!session) {
			return openAuthModal();
		}

		onOpen();
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
		<>
			<Button color="default" onClick={handleNewReward}>
				New Reward
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								New Reward
							</ModalHeader>
							<ModalBody>
								<Input
									label="Name"
									isRequired
									value={reward.name}
									onChange={(e) =>
										setReward({ ...reward, name: e.target.value })
									}
								/>

								<div className="flex gap-2">
									<Input
										type="number"
										label="Price"
										placeholder="0"
										value={reward.cost?.toString()}
										startContent={
											<div className="pointer-events-none flex items-center">
												<span className="text-default-400 text-small">🪙</span>
											</div>
										}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											const v = Number(e.target.value);

											setReward({
												...reward,
												cost: v,
											});
										}}
									/>

									<Input
										type="number"
										label="Quantity"
										value={reward.max_quantity?.toString()}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											let v = Number(e.target.value);

											if (Number.isInteger(v)) {
												if (v < 1) v = 1;
												if (v > 1000000) v = 1000000;
												setReward({
													...reward,
													max_quantity: v,
												});
											}
										}}
										min={1}
										max={1000000}
									/>
								</div>

								<Textarea
									label="Description"
									value={reward.description || ""}
									onChange={(e) =>
										setReward({ ...reward, description: e.target.value })
									}
								/>

								<Select
									label="Reset Interval"
									selectedKeys={[reward.reset_interval ?? "NEVER"]}
									onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
										setReward({
											...reward,
											reset_interval: e.target.value,
										});
									}}
								>
									{resetIntervals.map((pattern) => (
										<SelectItem key={pattern}>
											{capitalizeWord(pattern)}
										</SelectItem>
									))}
								</Select>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="light"
									onPress={() => {
										onClose();
									}}
								>
									Cancel
								</Button>
								<Button
									color="primary"
									onPress={() => {
										handleCreateReward();
										onClose();
									}}
									isDisabled={!reward.name}
								>
									Save
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export const resetIntervals = ["NEVER", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"];
