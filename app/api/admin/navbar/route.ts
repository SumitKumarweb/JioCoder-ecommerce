import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import NavbarItem from "@/models/NavbarItem";

// NOTE: Add proper admin authentication/authorization here before using in production.

export async function GET() {
  try {
    await connectDB();
    const items = await NavbarItem.find().sort({ order: 1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Admin GET /navbar failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch navbar items" },
      { status: 500 }
    );
  }
}

// Bulk save/replace navbar configuration
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const items = Array.isArray(body.items) ? body.items : [];

    await NavbarItem.deleteMany({});

    if (items.length > 0) {
      const docs = items.map((item: any, index: number) => ({
        label: item.label,
        href: item.href,
        enabled: item.enabled ?? true,
        order: item.order ?? index,
      }));
      await NavbarItem.insertMany(docs);
    }

    const saved = await NavbarItem.find().sort({ order: 1 }).lean();
    return NextResponse.json(saved);
  } catch (error) {
    console.error("Admin PUT /navbar failed:", error);
    return NextResponse.json(
      { message: "Failed to save navbar items" },
      { status: 500 }
    );
  }
}


