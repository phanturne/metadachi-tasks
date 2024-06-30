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
import { ProfileMenu } from "@/components/profile-menu";
import { Routes } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export default function RootNavbar() {
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
				{/* Leaderboard */}
				<NavbarItem className="hidden sm:flex">
					<Button isIconOnly radius="full" variant="light">
						<Icon icon="solar:crown-star-bold-duotone" width={24} />
					</Button>
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
				<NavbarItem className="px-2">
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
