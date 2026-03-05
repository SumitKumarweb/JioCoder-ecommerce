import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CommunityReview from "@/models/CommunityReview";

export async function GET() {
  try {
    await connectDB();

    const reviews = await CommunityReview.find()
      .sort({ highlight: -1, createdAt: -1 })
      .lean();

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Failed to fetch community reviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch community reviews" },
      { status: 500 }
    );
  }
}


