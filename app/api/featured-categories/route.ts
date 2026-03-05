import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import FeaturedCategory from "@/models/FeaturedCategory";

export async function GET() {
  try {
    await connectDB();

    const categories = await FeaturedCategory.find()
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch featured categories:", error);
    return NextResponse.json(
      { message: "Failed to fetch featured categories" },
      { status: 500 }
    );
  }
}


