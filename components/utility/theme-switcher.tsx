"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

export default function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();

	return (
		<ToggleGroup
			type="single"
			value={theme}
			onClick={(e) => e.preventDefault()}
			onValueChange={(value) => {
				if (value) setTheme(value);
			}}
			className="rounded-full border border-input bg-background p-0.5"
		>
			<ToggleGroupItem
				value="light"
				aria-label="Light theme"
				className="h-6 w-6 p-0 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
			>
				<Sun className="h-4 w-4 text-yellow-600" />
			</ToggleGroupItem>
			<ToggleGroupItem
				value="system"
				aria-label="System theme"
				className="h-6 w-6 p-0 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
			>
				<Monitor className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem
				value="dark"
				aria-label="Dark theme"
				className="h-6 w-6 p-0 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
			>
				<Moon className="h-4 w-4 text-blue-400" />
			</ToggleGroupItem>
		</ToggleGroup>
	);
}
