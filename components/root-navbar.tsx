// Source: https://www.nextui.pro/components/application/navigation-headers#component-navigation-header-with-tabs

"use client";

import ProfileMenu from "@/components/profile-menu";
import { useAuthModal } from "@/components/providers/auth-context-provider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "@/lib/hooks/use-session";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

const Routes = {
	Home: "/",
	Tasks: "/tasks",
	Moments: "/moments",
	Chat: "/chat",
	Tools: "/tools",
	Collections: "/collections",
	Explore: "/explore",
};

const routes = [
	{ route: Routes.Tasks, label: "Tasks" },
	{ route: Routes.Moments, label: "Moments" },
	{ route: Routes.Chat, label: "Chat" },
	{ route: Routes.Tools, label: "Tools" },
	{ route: Routes.Collections, label: "Collections" },
	{ route: Routes.Explore, label: "Explore" },
];

const MotionLink = motion(Link);

export default function RootNavbar() {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const { openAuthModal } = useAuthModal();
	const { session, isAnonymous } = useSession();
	const pathname = usePathname();

	function isActiveRoute(route: string) {
		if (pathname === Routes.Home && route === Routes.Tasks) return true;
		return pathname.split("/")[1] === route.split("/")[1];
	}

	return (
		<nav
			className={cn(
				"flex h-[64px] w-full items-center justify-between border-b px-4",
				isMenuOpen ? "bg-gray-200/50 dark:bg-gray-800/50" : "bg-transparent",
			)}
		>
			<div className="flex items-center">
				<Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon" className="mr-2 md:hidden">
							<Menu className="h-6 w-6" />
							<span className="sr-only">Toggle menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-[300px] p-0 sm:w-[400px]">
						<motion.nav
							className="flex flex-col gap-4 p-4"
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ ease: "easeInOut", duration: 0.2 }}
						>
							<AnimatePresence>
								{routes.map(({ route, label }, index) => (
									<motion.div
										key={route}
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ delay: index * 0.05 }}
									>
										<Link
											href={route}
											className={cn(
												"block px-2 py-1 text-lg",
												isActiveRoute(route) ? "font-medium" : "text-gray-500",
											)}
										>
											{label}
										</Link>
									</motion.div>
								))}
							</AnimatePresence>
						</motion.nav>
					</SheetContent>
				</Sheet>
				<Link href={Routes.Home} className="flex items-center">
					<Image
						src="/metadachi.svg"
						alt="Metadachi Icon"
						width={26}
						height={26}
					/>
					<span className="ml-2 font-medium">Metadachi</span>
				</Link>
			</div>

			<motion.div
				className="hidden h-11 items-center gap-4 rounded-full border border-gray-200/20 bg-background/60 px-4 shadow-md backdrop-blur-md backdrop-saturate-150 md:flex dark:bg-gray-800/50"
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2, duration: 0.5 }}
			>
				{routes.map(({ route, label }) => (
					<MotionLink
						key={route}
						href={route}
						className={cn(
							"text-sm",
							isActiveRoute(route)
								? "font-medium"
								: "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100",
						)}
						whileHover={{ scale: 1.05 }}
					>
						{label}
					</MotionLink>
				))}
			</motion.div>

			<motion.div
				className="flex items-center gap-2"
				initial={{ opacity: 0, x: 10 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.4, duration: 0.5 }}
			>
				{(!session || isAnonymous) && (
					<Button
						onClick={() => openAuthModal()}
						className="group rounded-full border-purple-500/30 bg-purple-500/20 text-purple-900 hover:bg-purple-500/30 dark:text-purple-300"
						style={{
							boxShadow: "inset 0 0 4px #bf97ffA0",
						}}
					>
						<span>✨ Get Started</span>
						<ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
					</Button>
				)}
				<div className="pl-2">
					<ProfileMenu />
				</div>
			</motion.div>
		</nav>
	);
}
