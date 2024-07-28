import type { Tables } from "@/supabase/types";
import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	type ChartOptions,
	Legend,
	LinearScale,
	Title,
	Tooltip,
} from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
);

interface GoldStatsChartProps {
	stats: Tables<"user_stats">[];
	startDate: string;
	endDate: string;
}

const options = (maxDataValue: number): ChartOptions<"bar"> => ({
	responsive: true,
	plugins: {
		legend: {
			position: "top" as const,
		},
		// title: {
		//   display: true,
		//   text: "Gold Earned vs Spent (Last 7 Days)",
		// },
	},
	scales: {
		y: {
			min: 0,
			// Set max value dynamically if data exists, otherwise default to 100
			max: maxDataValue > 0 ? maxDataValue : 100,
		},
	},
});

export function GoldStatsChart({
	stats,
	startDate,
	endDate,
}: GoldStatsChartProps) {
	const processData = () => {
		const labels: string[] = [];
		const goldEarned: number[] = [];
		const goldSpent: number[] = [];
		let maxValue = 0;

		for (
			let d = new Date(startDate);
			d <= new Date(endDate);
			d.setDate(d.getDate() + 1)
		) {
			const dateString = d.toISOString().split("T")[0];
			labels.push(dateString);

			const dayStats = stats.find((s) => s.date === dateString);
			const earned = dayStats?.gold_earned ?? 0;
			const spent = dayStats?.gold_spent ?? 0;

			goldEarned.push(earned);
			goldSpent.push(spent);

			maxValue = Math.max(maxValue, earned, spent);
		}

		return { labels, goldEarned, goldSpent, maxValue };
	};

	const { labels, goldEarned, goldSpent, maxValue } = processData();

	const chartData = {
		labels,
		datasets: [
			{
				label: "Gold Earned",
				data: goldEarned,
				backgroundColor: "rgba(0, 128, 0, 0.6)", // Green
			},
			{
				label: "Gold Spent",
				data: goldSpent,
				backgroundColor: "rgba(255, 0, 0, 0.6)", // Red
			},
		],
	};

	return <Bar options={options(maxValue)} data={chartData} />;
}
