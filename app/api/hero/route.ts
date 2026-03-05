import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HeroSlide from "@/models/HeroSlide";

export async function GET() {
  try {
    await connectDB();

    const slides = await HeroSlide.find({ enabled: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return NextResponse.json(slides);
  } catch (error) {
    console.error("Failed to fetch hero slides:", error);
    return NextResponse.json(
      { message: "Failed to fetch hero slides" },
      { status: 500 }
    );
  }
}


