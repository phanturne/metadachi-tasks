import { resetIntervals } from "@/components/rewards/new-reward-button";
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
} from "@nextui-org/react";
import type React from "react";
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
		<Modal isOpen={isOpen} onClose={onClose} size="2xl">
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					{localReward.name}
				</ModalHeader>
				<ModalBody>
					<Input
						label="Name"
						isRequired
						value={localReward.name}
						onChange={(e) =>
							setLocalReward({ ...localReward, name: e.target.value })
						}
					/>

					<div className="flex gap-2">
						<Input
							type="number"
							label="Price"
							placeholder="0"
							value={localReward.cost?.toString()}
							startContent={
								<div className="pointer-events-none flex items-center">
									<span className="text-default-400 text-small">🪙</span>
								</div>
							}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								const v = Number(e.target.value);

								setLocalReward({
									...localReward,
									cost: v,
								});
							}}
						/>

						<Input
							type="number"
							label="Quantity"
							value={localReward.quantity?.toString()}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								let v = Number(e.target.value);

								if (Number.isInteger(v)) {
									if (v < 1) v = 1;
									if (v > localReward.max_quantity)
										v = localReward.max_quantity ?? 999;
									setLocalReward({
										...localReward,
										quantity: v,
									});
								}
							}}
							min={1}
							max={localReward.max_quantity as number}
						/>

						<Input
							type="number"
							label="Max Quantity"
							value={localReward.max_quantity?.toString()}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								let v = Number(e.target.value);

								if (Number.isInteger(v)) {
									if (v < 1) v = 1;
									if (v > 1000000) v = 1000000;
									setLocalReward({
										...localReward,
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
						value={localReward.description || ""}
						onChange={(e) =>
							setLocalReward({ ...localReward, description: e.target.value })
						}
					/>

					<Select
						label="Reset Interval"
						selectedKeys={[localReward.reset_interval ?? "NEVER"]}
						onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
							setLocalReward({
								...localReward,
								reset_interval: e.target.value,
							});
						}}
					>
						{resetIntervals.map((pattern) => (
							<SelectItem key={pattern}>{capitalizeWord(pattern)}</SelectItem>
						))}
					</Select>
				</ModalBody>
				<ModalFooter>
					<Button
						color="danger"
						variant="light"
						onPress={() => {
							onDelete();
							onClose();
						}}
					>
						Delete
					</Button>
					<Button
						color="primary"
						onPress={() => {
							onSave(localReward);
							onClose();
						}}
					>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
