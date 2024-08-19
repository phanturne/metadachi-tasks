import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { Toaster } from "@/components/utility/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Metadachi",
	description:
		"Boost your productivity with AI-powered tools and vibrant community features.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers attribute="class" defaultTheme="system" enableSystem>
					<Toaster richColors position="bottom-center" duration={3000} />
					{children}
				</Providers>
			</body>
		</html>
	);
}
