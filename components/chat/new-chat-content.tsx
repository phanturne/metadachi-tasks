import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import * as React from "react";

export const NewChatContent = () => {
	return (
		<motion.div
			className="flex flex-col items-center justify-center space-y-6 p-4 text-center"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<motion.div
				whileHover={{ scale: 1.1, rotate: 360 }}
				transition={{ type: "spring", stiffness: 260, damping: 20 }}
			>
				<Image
					src="/metadachi.svg"
					alt="Metadachi Icon"
					width={100}
					height={100}
					className="rounded-full bg-primary/10 p-4"
				/>
			</motion.div>
			<h2 className="font-bold text-2xl">How may I assist you today?</h2>
			<p className="max-w-md text-muted-foreground">
				I'm your AI assistant, ready to help with any questions or tasks you
				have. Feel free to ask about any topic!
			</p>
			<div className="flex space-x-4">
				<Button variant="outline">Start a new chat</Button>
				<Button>Learn more</Button>
			</div>
		</motion.div>
	);
};
