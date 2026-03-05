import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import InstagramReel from "@/models/InstagramReel";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Only fetch active reels for public display
    const reels = await InstagramReel.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(12) // Limit to 12 reels for homepage
      .lean();

    return NextResponse.json(reels);
  } catch (error) {
    console.error("GET /instagram-reels failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch Instagram reels" },
      { status: 500 }
    );
  }
}

