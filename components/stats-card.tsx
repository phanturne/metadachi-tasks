"use client";

import { Icon } from "@iconify/react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import React from "react";

export default function StatsCard() {
	const pointChange = 10;

	return (
		<Card className="px-4 rounded-lg w-full flex flex-col overflow-y-scroll">
			<CardHeader className="flex justify-between">
				<h1 className="text-xl bold">Stats</h1>
			</CardHeader>
			<CardBody className="overflow-visible">
				{/* Points */}
				<p className="flex items-center">
					<span className="font-semibold">Points:</span>
					<span className="ml-2">120</span>
					{pointChange > 0 ? (
						<div className="flex items-center text-green-500 ml-2">
							<Icon icon="solar:alt-arrow-up-bold" width={24} />
							<span className="ml-1">{pointChange}</span>
						</div>
					) : (
						<div className="flex items-center text-red-500 ml-2">
							<Icon icon="solar:alt-arrow-down-bold" width={24} />
							<span className="ml-1">{pointChange}</span>
						</div>
					)}
				</p>

				{/* Tasks Completed Today */}
				<p className="flex items-center">
					<span className="font-semibold">Tasks Completed Today:</span>
					<span className="ml-2">6</span>
				</p>

				{/*	TODO: Include chart here */}
			</CardBody>
		</Card>
	);
}
