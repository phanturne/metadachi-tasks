import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
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

export const options = {
	responsive: true,
	// plugins: {
	// 	legend: {
	// 		position: "top" as const,
	// 	},
	// 	title: {
	// 		display: true,
	// 		text: "Chart.js Bar Chart",
	// 	},
	// },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

// Mock data
const dataset1Data = [100, 200, 300, 400, 500, 600, 700];
const dataset2Data = [150, 250, 350, 450, 550, 650, 750];

export const data = {
	labels,
	datasets: [
		{
			label: "Dataset 1",
			data: dataset1Data,
			backgroundColor: "rgba(255, 99, 132, 0.5)",
		},
		{
			label: "Dataset 2",
			data: dataset2Data,
			backgroundColor: "rgba(53, 162, 235, 0.5)",
		},
	],
};

export function StatsChart() {
	return <Bar options={options} data={data} />;
}
