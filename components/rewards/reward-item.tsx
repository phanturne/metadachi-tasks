// Source: https://nextui.pro/components/ecommerce/product-list#component-place-list-grid

"use client";

import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Button, Image, Skeleton } from "@nextui-org/react";
import React from "react";

export type RewardListItemColor = {
	name: string;
	hex: string;
};

export type RewardItem = {
	id: string;
	name: string;
	href: string;
	price: number;
	description?: string;
	imageSrc: string;
};

export type RewardListItemProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	"id"
> & {
	isPopular?: boolean;
	isLoading?: boolean;
	removeWrapper?: boolean;
} & RewardItem;

const RewardListItem = React.forwardRef<HTMLDivElement, RewardListItemProps>(
	(
		{
			name,
			price,
			isLoading,
			description,
			imageSrc,
			removeWrapper,
			className,
			...props
		},
		ref,
	) => {
		const [isLiked, setIsLiked] = React.useState(false);

		return (
			<div
				ref={ref}
				className={cn(
					"relative flex w-full flex-none flex-col gap-3",
					{
						"rounded-none bg-background shadow-none": removeWrapper,
					},
					className,
				)}
				{...props}
			>
				{/* TODO: Handle purchase reward*/}
				<Button
					isIconOnly
					className="absolute right-2 top-2 z-20 bg-background/60 backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50"
					radius="full"
					size="sm"
					variant="flat"
					onPress={() => setIsLiked(!isLiked)}
				>
					<Icon
						className={cn("text-default-900/50", {
							"text-danger-400": isLiked,
						})}
						icon="mingcute:add-fill"
						width={16}
					/>
				</Button>
				<Image
					isBlurred
					isZoomed
					alt={name}
					className="aspect-square w-full hover:scale-110"
					isLoading={isLoading}
					src={imageSrc}
				/>

				<div className="mt-1 flex flex-col gap-2 px-1">
					{isLoading ? (
						<div className="my-1 flex flex-col gap-3">
							<Skeleton className="w-3/5 rounded-lg">
								<div className="h-3 w-3/5 rounded-lg bg-default-200" />
							</Skeleton>
							<Skeleton className="mt-3 w-4/5 rounded-lg">
								<div className="h-3 w-4/5 rounded-lg bg-default-200" />
							</Skeleton>
							<Skeleton className="mt-4 w-2/5 rounded-lg">
								<div className="h-3 w-2/5 rounded-lg bg-default-300" />
							</Skeleton>
						</div>
					) : (
						<>
							<div className="flex items-start justify-between gap-1">
								<h3 className="text-small font-medium text-default-700 truncate">
									{name}
								</h3>
							</div>
							{/*{description ? (*/}
							{/*	<p className="text-small text-default-500">{description}</p>*/}
							{/*) : null}*/}
							<p className="text-small font-medium text-default-500 text-center">
								{price} 🪙
							</p>
						</>
					)}
				</div>
			</div>
		);
	},
);

RewardListItem.displayName = "RewardListItem";

export default RewardListItem;
