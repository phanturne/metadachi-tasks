import type { ClassValue } from "clsx";
import clsx from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const COMMON_UNITS = ["small", "medium", "large"];

/**
 * We need to extend the tailwind merge to include NextUI's custom classes.
 *
 * So we can use classes like `text-small` or `text-default-500` and override them.
 */
const twMerge = extendTailwindMerge({
	extend: {
		theme: {
			opacity: ["disabled"],
			spacing: ["divider"],
			borderWidth: COMMON_UNITS,
			borderRadius: COMMON_UNITS,
		},
		classGroups: {
			shadow: [{ shadow: COMMON_UNITS }],
			"font-size": [{ text: ["tiny", ...COMMON_UNITS] }],
			"bg-image": ["bg-stripe-gradient"],
		},
	},
});

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDateTime(dateTime: string): string {
	const date = new Date(dateTime);

	// Check if the date is valid
	if (Number.isNaN(date.getTime())) {
		return "Invalid date";
	}

	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	};

	// Use a single call to toLocaleString with combined options for date and time
	return date.toLocaleString(undefined, options);
}

// Helper function to create a delay using setTimeout
export const delay = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const capitalizeWord = (word: string): string =>
	word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
	const result = { ...obj };
	for (const key of keys) {
		delete result[key];
	}
	return result as Omit<T, K>;
}

function pick<T extends object, K extends keyof T>(
	obj: T,
	keys: K[],
): Pick<T, K> {
	const result = {} as Partial<T>;
	for (const key of keys) {
		if (key in obj) {
			result[key] = obj[key];
		}
	}
	return result as Pick<T, K>;
}
