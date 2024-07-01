import RootNavbar from "@/components/root-navbar";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex h-dvh flex-col">
			<RootNavbar />
			{children}
		</div>
	);
}
