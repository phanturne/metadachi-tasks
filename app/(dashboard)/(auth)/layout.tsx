export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex justify-center items-center h-screen p-4">
			<div className="text-center max-w-md w-full p-4">{children}</div>
		</div>
	);
}
