import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import GalleryItem from "@/models/GalleryItem";

// NOTE: Add proper admin authentication/authorization here before using in production.

export async function GET() {
  try {
    await connectDB();
    const items = await GalleryItem.find().sort({ order: 1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Admin GET /live-gallery failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch gallery items" },
      { status: 500 }
    );
  }
}

// Bulk replace gallery items
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const items = Array.isArray(body.items) ? body.items : [];

    await GalleryItem.deleteMany({});

    if (items.length > 0) {
      const docs = items.map((item: any, index: number) => ({
        image: item.image,
        title: item.title,
        description: item.description,
        url: item.url,
        order: item.order ?? index,
      }));
      await GalleryItem.insertMany(docs);
    }

    const saved = await GalleryItem.find().sort({ order: 1 }).lean();
    return NextResponse.json(saved);
  } catch (error) {
    console.error("Admin PUT /live-gallery failed:", error);
    return NextResponse.json(
      { message: "Failed to save gallery items" },
      { status: 500 }
    );
  }
}


