import { Icon } from "@iconify/react";

export function EmptyRewardsList() {
	return (
		<div className="h-full w-full flex flex-col items-center justify-center text-center space-y-4">
			<Icon
				icon="solar:medal-ribbons-star-bold"
				className="size-28 text-yellow-500"
			/>
			<p className="text-lg">
				No rewards yet. Start by adding something to redeem!
			</p>
		</div>
	);
}
