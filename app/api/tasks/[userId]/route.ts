import { getTasksWithInstances } from "@/lib/db/tasks";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { userId: string } },
) {
	const { userId } = params;

	if (!userId) {
		return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
	}

	try {
		const tasks = await getTasksWithInstances(userId);
		return NextResponse.json(tasks);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch tasks" },
			{ status: 500 },
		);
	}
}
