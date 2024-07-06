"use client";

import { AuthContextProvider } from "@/components/providers/auth-context-provider";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import * as React from "react";

export function Providers({ children, ...props }: ThemeProviderProps) {
	return (
		<NextUIProvider>
			<NextThemesProvider {...props}>
				<AuthContextProvider>{children}</AuthContextProvider>
			</NextThemesProvider>
		</NextUIProvider>
	);
}
