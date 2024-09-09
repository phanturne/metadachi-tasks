"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	type Assistant,
	DEFAULT_ASSISTANTS,
	GeorgiaTechAssistant,
} from "@/lib/chat/default-assistants";
import { useActions } from "ai/rsc";

export function NewChatContent() {
	const { setAssistant } = useActions();
	const [selectedAssistant, setSelectedAssistant] = useState<
		Assistant | undefined
	>(undefined);

	const handleClearSelection = () => {
		setSelectedAssistant(undefined);
	};

	return (
		<motion.div
			className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center space-y-8 p-4 text-center sm:p-8"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<motion.div
				whileHover={{ scale: 1.1, rotate: 360 }}
				transition={{ type: "spring", stiffness: 260, damping: 20 }}
				className="relative h-[100px] w-[100px] rounded-full bg-primary/10"
			>
				<Image
					src={selectedAssistant?.image ?? "/metadachi-icon-circle.png"}
					alt={selectedAssistant?.name ?? "Metadachi"}
					fill
					className="rounded-full object-cover"
				/>
			</motion.div>
			<div>
				<h2 className="font-bold text-3xl sm:text-4xl">
					{selectedAssistant ? selectedAssistant.name : "Select an assistant"}
				</h2>
			</div>
			<div className="flex w-full max-w-xs flex-col items-center space-y-2 sm:max-w-md sm:flex-row sm:space-x-2 sm:space-y-0">
				<Select
					value={selectedAssistant ? selectedAssistant.name : ""}
					onValueChange={(value) => {
						setSelectedAssistant(
							value === GeorgiaTechAssistant.name
								? GeorgiaTechAssistant
								: DEFAULT_ASSISTANTS.find((a) => a.name === value),
						);
						setAssistant(GeorgiaTechAssistant);
					}}
				>
					<SelectTrigger className="h-12 w-full text-lg shadow-md">
						<SelectValue placeholder="Select an assistant" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={GeorgiaTechAssistant.name}>
							<div className="flex items-center">
								<div className="relative mr-2 h-8 w-8 overflow-hidden rounded-full">
									<Image
										src={GeorgiaTechAssistant?.image ?? ""}
										alt={GeorgiaTechAssistant.name}
										fill
										className="object-cover"
									/>
								</div>
								<span className="font-medium text-base">
									{GeorgiaTechAssistant.name}
								</span>
							</div>
						</SelectItem>
						{DEFAULT_ASSISTANTS.map((assistant) => (
							<SelectItem key={assistant.id} value={assistant.name}>
								<div className="flex items-center">
									<div className="relative mr-2 h-8 w-8 overflow-hidden rounded-full">
										<Image
											src={assistant.image}
											alt={assistant.name}
											fill
											className="object-cover"
										/>
									</div>
									<span className="font-medium text-base">
										{assistant.name}
									</span>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{selectedAssistant && (
					<Button
						variant="outline"
						size="icon"
						onClick={handleClearSelection}
						className="mt-2 h-12 w-12 sm:mt-0"
					>
						<X className="h-6 w-6" />
					</Button>
				)}
			</div>
			<AnimatePresence mode="wait">
				<motion.div
					key={selectedAssistant ? "description" : "grid"}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.5 }}
					className="w-full max-w-3xl"
				>
					{selectedAssistant ? (
						<motion.p
							className="mx-auto max-w-md pt-2 text-muted-foreground"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
						>
							{selectedAssistant.description}
						</motion.p>
					) : (
						<div className="space-y-4">
							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<Card
									className="group relative cursor-pointer overflow-hidden transition-all hover:shadow-lg"
									onClick={() => {
										setSelectedAssistant(GeorgiaTechAssistant);
										setAssistant(GeorgiaTechAssistant);
									}}
								>
									<motion.div
										className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 opacity-0"
										animate={{
											opacity: [0, 1, 0],
										}}
										transition={{
											repeat: Number.POSITIVE_INFINITY,
											duration: 3,
											ease: "easeInOut",
										}}
									/>
									<CardContent className="flex items-center p-2 px-4">
										<div className="relative mr-4 h-8 w-8 overflow-hidden rounded-full transition-all group-hover:scale-110">
											<Image
												src={GeorgiaTechAssistant?.image ?? ""}
												alt={GeorgiaTechAssistant.name}
												fill
												className="object-cover"
											/>
										</div>
										<div className="flex-grow text-left">
											<p className="font-medium text-sm">
												{GeorgiaTechAssistant.name}
											</p>
										</div>
										<span className="rounded-full bg-primary/20 px-2 py-1 text-primary text-xs">
											Featured
										</span>
									</CardContent>
								</Card>
							</motion.div>
							<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
								{DEFAULT_ASSISTANTS.map((assistant) => (
									<motion.div
										key={assistant.id}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Card
											className="group h-full cursor-pointer overflow-hidden transition-all hover:shadow-lg"
											onClick={() => {
												setSelectedAssistant(assistant);
												setAssistant(assistant);
											}}
										>
											<CardContent className="flex h-full flex-col items-center justify-center p-4">
												<div className="relative h-12 w-12 overflow-hidden rounded-full transition-all group-hover:scale-110">
													<Image
														src={assistant?.image ?? ""}
														alt={assistant.name}
														fill
														className="object-cover"
													/>
												</div>
												<p className="mt-2 line-clamp-2 text-center font-medium text-xs">
													{assistant.name}
												</p>
											</CardContent>
										</Card>
									</motion.div>
								))}
							</div>
						</div>
					)}
				</motion.div>
			</AnimatePresence>
		</motion.div>
	);
}
