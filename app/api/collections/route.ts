import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Collection from "@/models/Collection";

export async function GET() {
  try {
    await connectDB();
    const collections = await Collection.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(collections);
  } catch (error) {
    console.error("Failed to fetch collections:", error);
    return NextResponse.json(
      { message: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}

