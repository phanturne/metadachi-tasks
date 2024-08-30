export interface Prompt {
	id: string;
	name: string;
	content: string;
	emoji: string;
}

export const prompts: Prompt[] = [
	{
		id: "task1",
		name: "Create a Task",
		content: "Create a task for me based on the following:",
		emoji: "📝",
	},
	{
		id: "task2",
		name: "Set a Reward",
		content: "Suggest a reward I can enjoy after completing this task.",
		emoji: "🎉",
	},
	{
		id: "task3",
		name: "Break It Down",
		content: "Help me break this task into smaller, manageable steps.",
		emoji: "🔍",
	},
	{
		id: "task4",
		name: "Motivation Booster",
		content:
			"Give me a motivational message that connects this task to my larger goals.",
		emoji: "💪",
	},
	{
		id: "task5",
		name: "Time Blocking",
		content:
			"Help me allocate a specific time block for this task and suggest setting a timer.",
		emoji: "⏰",
	},
	{
		id: "task6",
		name: "Reflect on Progress",
		content:
			"Prompt me to reflect on my progress and summarize what I have achieved.",
		emoji: "🔄",
	},
	{
		id: "task7",
		name: "Positive Affirmation",
		content:
			"Generate a positive affirmation to help keep me motivated throughout the day.",
		emoji: "✨",
	},
	{
		id: "task8",
		name: "End of Day Reflection",
		content:
			"Summarize my achievements for the day and suggest ways I can improve tomorrow.",
		emoji: "🌅",
	},
	{
		id: "task9",
		name: "Gratitude Reminder",
		content:
			"Encourage me to reflect on and list three things I'm grateful for today.",
		emoji: "🙏",
	},
	{
		id: "task10",
		name: "Weekly Goal Setting",
		content: "Help me outline my top three goals for the week.",
		emoji: "📅",
	},
	{
		id: "task11",
		name: "Mindful Break",
		content:
			"Start a timer for a 5-minute break for me to relax and clear my mind before the next task.",
		emoji: "🧘",
	},
	{
		id: "task12",
		name: "Focus Session",
		content:
			"Initiate a 25-minute focus session using the Pomodoro technique and specify what I should work on.",
		emoji: "🍅",
	},
];
