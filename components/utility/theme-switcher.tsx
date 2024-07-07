import { Icon } from "@iconify/react";
import { Tab, Tabs } from "@nextui-org/react";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();

	return (
		<Tabs
			variant="bordered"
			size="sm"
			radius="full"
			selectedKey={theme}
			p
			onSelectionChange={(key) => setTheme(key as string)}
			classNames={{
				tabList: "p-0.5 gap-1",
				tab: "h-6 w-6",
			}}
		>
			<Tab
				key="light"
				title={
					<div className="flex justify-center">
						<Icon icon="solar:sun-bold" className="text-base text-yellow-600" />
					</div>
				}
			/>
			<Tab
				key="system"
				title={
					<div className="flex justify-center">
						<Icon icon="solar:monitor-bold" className="h-4 text-base" />
					</div>
				}
			/>
			<Tab
				key="dark"
				title={
					<div className="flex justify-center">
						<Icon icon="solar:moon-bold" className="text-base text-blue-400" />
					</div>
				}
			/>
		</Tabs>
	);
}
