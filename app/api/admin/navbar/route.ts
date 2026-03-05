import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import NavbarItem from "@/models/NavbarItem";

// GET: Fetch all navbar items
export async function GET() {
  try {
    await connectDB();
    const items = await NavbarItem.find({}).sort({ order: 1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch navbar items:", error);
    return NextResponse.json(
      { message: "Failed to fetch navbar items" },
      { status: 500 }
    );
  }
}

// POST: Create or update multiple navbar items
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { message: "Items must be an array" },
        { status: 400 }
      );
    }

    // Delete all existing items
    await NavbarItem.deleteMany({});

    // Insert new items with order
    const itemsToInsert = items.map((item: any, index: number) => ({
      label: item.label,
      href: item.href,
      enabled: item.enabled !== false,
      order: index,
    }));

    const created = await NavbarItem.insertMany(itemsToInsert);

    return NextResponse.json({
      message: "Navbar items saved successfully",
      items: created,
    });
  } catch (error) {
    console.error("Failed to save navbar items:", error);
    return NextResponse.json(
      { message: "Failed to save navbar items" },
      { status: 500 }
    );
  }
}
