import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import NavbarItem from "@/models/NavbarItem";
import Collection from "@/models/Collection";

export async function GET() {
  try {
    await connectDB();

    const [navItems, collections] = await Promise.all([
      NavbarItem.find({ enabled: true }).sort({ order: 1 }).lean(),
      Collection.find({ isFeatured: true }).sort({ createdAt: -1 }).lean(),
    ]);

    return NextResponse.json({
      navItems,
      collections,
    });
  } catch (error) {
    console.error("Failed to fetch navbar config:", error);
    return NextResponse.json(
      { message: "Failed to fetch navbar config" },
      { status: 500 }
    );
  }
}


