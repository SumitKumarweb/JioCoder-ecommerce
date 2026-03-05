import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CommunityReview from "@/models/CommunityReview";

// NOTE: Add proper admin authentication/authorization here before using in production.

export async function GET() {
  try {
    await connectDB();
    const reviews = await CommunityReview.find()
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Admin GET /community-reviews failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const review = await CommunityReview.create({
      authorName: body.authorName,
      avatarUrl: body.avatarUrl,
      rating: body.rating,
      title: body.title,
      content: body.content,
      product: body.productId,
      highlight: body.highlight ?? false,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Admin POST /community-reviews failed:", error);
    return NextResponse.json(
      { message: "Failed to create review" },
      { status: 500 }
    );
  }
}


