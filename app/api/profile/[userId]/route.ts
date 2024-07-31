import { getProfileByUserId } from "@/lib/db/profile";
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
		const profile = await getProfileByUserId(userId);

		if (!profile) {
			return NextResponse.json({ error: "Profile not found" }, { status: 404 });
		}

		return NextResponse.json(profile);
	} catch (error) {
		console.error("Error fetching profile:", error);
		return NextResponse.json(
			{ error: "Failed to fetch profile" },
			{ status: 500 },
		);
	}
}
