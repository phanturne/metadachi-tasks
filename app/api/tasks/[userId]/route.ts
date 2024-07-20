import type { TaskWithInstances } from "@/lib/db/tasks";
import { createClient } from "@/lib/supabase/server";
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

const getTasksWithInstances = async (
	userId: string,
): Promise<TaskWithInstances[]> => {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("tasks")
		.select(`
      *,
      instances:task_instances(*)
    `)
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (error) throw new Error(error.message);
	return data as TaskWithInstances[];
};
