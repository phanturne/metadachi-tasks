"use client";

import { AuthContextProvider } from "@/components/providers/auth-context-provider";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import * as React from "react";

export function Providers({ children, ...props }: ThemeProviderProps) {
	return (
		<NextThemesProvider {...props}>
			<AuthContextProvider>{children}</AuthContextProvider>
		</NextThemesProvider>
	);
}
