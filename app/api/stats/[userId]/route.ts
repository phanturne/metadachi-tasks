import { getUserStats } from "@/lib/db/user_stats";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { userId: string } },
) {
	const { userId } = params;
	const { searchParams } = new URL(request.url);
	const startDate = searchParams.get("startDate");
	const endDate = searchParams.get("endDate");

	if (!userId || !startDate || !endDate) {
		return NextResponse.json(
			{ error: "Missing required parameters" },
			{ status: 400 },
		);
	}

	try {
		const stats = await getUserStats(userId, startDate, endDate);
		return NextResponse.json(stats);
	} catch (error) {
		console.error("Error fetching user stats:", error);
		return NextResponse.json(
			{ error: "Failed to fetch user stats" },
			{ status: 500 },
		);
	}
}
