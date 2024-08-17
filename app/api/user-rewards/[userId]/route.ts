import { getUserRewards } from "@/lib/db/rewards";
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
		const rewards = await getUserRewards(userId);
		return NextResponse.json(rewards);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch rewards." },
			{ status: 500 },
		);
	}
}
