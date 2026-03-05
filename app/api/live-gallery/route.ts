import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import GalleryItem from "@/models/GalleryItem";

export async function GET() {
  try {
    await connectDB();

    const items = await GalleryItem.find()
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch live gallery items:", error);
    return NextResponse.json(
      { message: "Failed to fetch live gallery items" },
      { status: 500 }
    );
  }
}


