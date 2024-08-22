// Source: https://www.nextui.pro/components/application/navigation-headers#component-navigation-header-with-tabs

"use client";

import ProfileMenu from "@/components/profile-menu";
import { useAuthModal } from "@/components/providers/auth-context-provider";
import { Routes } from "@/lib/constants";
import { useSession } from "@/lib/hooks/use-session";
import { cn } from "@/lib/utils";
import {
	Button,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const routes = [
	{ route: Routes.Tasks, label: "Tasks" },
	{ route: Routes.Moments, label: "Moments" },
	{ route: Routes.Chat, label: "Chat" },
	{ route: Routes.Tools, label: "Tools" },
	// { route: Routes.Friends, label: "Friends" },
	{ route: Routes.Collections, label: "Collections" },
	{ route: Routes.Explore, label: "Explore" },
];

export default function RootNavbar() {
	const { openAuthModal } = useAuthModal();
	const { session, isAnonymous } = useSession();

	const pathname = usePathname();
	function isActiveRoute(route: string) {
		// Hacky: Task page is considered active when on the home page
		if (pathname === Routes.Home && route === Routes.Tasks) return true;

		return pathname.split("/")[1] === route.split("/")[1];
	}

	return (
		<Navbar
			maxWidth="full"
			height="64px"
			classNames={{
				base: cn("border-default-100", {
					"bg-default-200/50 dark:bg-default-100/50": false,
				}),
				wrapper: "w-full justify-center bg-transparent ",
				item: "hidden md:flex",
			}}
		>
			<NavbarBrand>
				{/*<NavbarMenuToggle className="mr-2 h-6 sm:hidden" />*/}
				<Link
					href={Routes.Home}
					color="foreground"
					className="flex justify-center"
				>
					<Image
						src="/metadachi.svg"
						alt="Metadachi Icon"
						width={26}
						height={26}
					/>
					<span className="ml-2 font-medium">Metadachi</span>
				</Link>
			</NavbarBrand>

			{/* Menu */}
			<NavbarContent
				className="hidden h-11 gap-4 rounded-full border-default-200/20 border-small bg-background/60 px-4 shadow-medium backdrop-blur-md backdrop-saturate-150 md:flex dark:bg-default-100/50"
				justify="center"
			>
				{routes.map(({ route, label }) => (
					<NavbarItem key={route} isActive={isActiveRoute(route)}>
						<Link
							className={isActiveRoute(route) ? "" : "text-default-500"}
							href={route}
							color={isActiveRoute(route) ? "foreground" : undefined}
						>
							{label}
						</Link>
					</NavbarItem>
				))}
			</NavbarContent>

			{/* Right Menu */}
			<NavbarContent justify="end">
				{/* Auth Button */}
				<NavbarItem>
					{(!session || isAnonymous) && (
						<Button
							className="border-secondary-500/30 border-small bg-secondary-500/20 text-secondary-900 hover:bg-secondary-500/30"
							color="secondary"
							radius="full"
							style={{
								boxShadow: "inset 0 0 4px #bf97ffA0",
							}}
							onClick={() => openAuthModal()}
							variant="flat"
						>
							Get Started
						</Button>
					)}
				</NavbarItem>

				{/* Quests */}
				{/*<NavbarItem className="hidden sm:flex">*/}
				{/*	<Button isIconOnly radius="full" variant="light">*/}
				{/*		<Icon icon="solar:checklist-minimalistic-bold-duotone" width={24} />*/}
				{/*	</Button>*/}
				{/*</NavbarItem>*/}

				{/* Notifications */}
				{/*<NavbarItem className="flex">*/}
				{/*	<NotificationsMenu />*/}
				{/*</NavbarItem>*/}

				{/* User Menu */}
				<NavbarItem className="pl-2">
					<ProfileMenu />
				</NavbarItem>
			</NavbarContent>

			{/* Mobile Menu */}
			<NavbarMenu
				className="top-[calc(var(--navbar-height)_-_1px)] max-h-[70vh] bg-default-200/50 pt-6 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50"
				motionProps={{
					initial: { opacity: 0, y: -20 },
					animate: { opacity: 1, y: 0 },
					exit: { opacity: 0, y: -20 },
					transition: {
						ease: "easeInOut",
						duration: 0.2,
					},
				}}
			>
				{routes.map(({ route, label }) => (
					<NavbarMenuItem key={route} isActive={isActiveRoute(route)}>
						<Link
							className={isActiveRoute(route) ? "" : "text-default-500"}
							href={route}
							color={isActiveRoute(route) ? "foreground" : undefined}
						>
							{label}
						</Link>
					</NavbarMenuItem>
				))}
			</NavbarMenu>
		</Navbar>
	);
}
