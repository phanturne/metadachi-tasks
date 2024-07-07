// Source: https://www.nextui.pro/components/application/navigation-headers#component-navigation-header-with-tabs

"use client";

import { Icon } from "@iconify/react";
import {
	Button,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@nextui-org/react";
import React from "react";

import { NotificationsMenu } from "@/components/notifications/notifications-menu";
import ProfileMenu from "@/components/profile-menu";
import { useAuthModal } from "@/components/providers/auth-context-provider";
import { Routes } from "@/lib/constants";
import { useSession } from "@/lib/hooks/use-session";
import Image from "next/image";
import Link from "next/link";

export default function RootNavbar() {
	const { openAuthModal } = useAuthModal();
	const { session, isAnonymous } = useSession();

	return (
		<Navbar maxWidth="full" height="60px">
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

			{/* Right Menu */}
			<NavbarContent
				className="ml-auto h-12 max-w-fit items-center gap-0"
				justify="end"
			>
				{/* Auth Button */}
				<NavbarItem>
					{(!session || isAnonymous) && (
						<Button
							className="border-small border-secondary-500/30 bg-secondary-500/20 text-secondary-900 hover:bg-secondary-500/30"
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
				<NavbarItem className="hidden sm:flex">
					<Button isIconOnly radius="full" variant="light">
						<Icon icon="solar:checklist-minimalistic-bold-duotone" width={24} />
					</Button>
				</NavbarItem>

				{/* Notifications */}
				<NavbarItem className="flex">
					<NotificationsMenu />
				</NavbarItem>

				{/* User Menu */}
				<NavbarItem className="pl-2">
					<ProfileMenu />
				</NavbarItem>
			</NavbarContent>

			{/* Mobile Menu */}
			{/*<NavbarMenu>*/}
			{/*	<NavbarMenuItem>*/}
			{/*		<Link className="w-full" color="foreground" href="#">*/}
			{/*			Dashboard*/}
			{/*		</Link>*/}
			{/*	</NavbarMenuItem>*/}
			{/*	<NavbarMenuItem isActive>*/}
			{/*		<Link aria-current="page" className="w-full" color="primary" href="#">*/}
			{/*			Deployments*/}
			{/*		</Link>*/}
			{/*	</NavbarMenuItem>*/}
			{/*	<NavbarMenuItem>*/}
			{/*		<Link className="w-full" color="foreground" href="#">*/}
			{/*			Analytics*/}
			{/*		</Link>*/}
			{/*	</NavbarMenuItem>*/}
			{/*	<NavbarMenuItem>*/}
			{/*		<Link className="w-full" color="foreground" href="#">*/}
			{/*			Team*/}
			{/*		</Link>*/}
			{/*	</NavbarMenuItem>*/}
			{/*	<NavbarMenuItem>*/}
			{/*		<Link className="w-full" color="foreground" href="#">*/}
			{/*			Settings*/}
			{/*		</Link>*/}
			{/*	</NavbarMenuItem>*/}
			{/*</NavbarMenu>*/}
		</Navbar>
	);
}
