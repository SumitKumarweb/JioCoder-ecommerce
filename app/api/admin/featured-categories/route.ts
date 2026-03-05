import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import FeaturedCategory from "@/models/FeaturedCategory";

// NOTE: Add proper admin authentication/authorization here before using in production.

export async function GET() {
  try {
    await connectDB();
    const categories = await FeaturedCategory.find()
      .sort({ order: 1 })
      .lean();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Admin GET /featured-categories failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch featured categories" },
      { status: 500 }
    );
  }
}

// Bulk save/replace featured categories
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const categories = Array.isArray(body.categories) ? body.categories : [];

    await FeaturedCategory.deleteMany({});

    if (categories.length > 0) {
      const docs = categories.map((cat: any, index: number) => ({
        name: cat.name,
        image: cat.image,
        url: cat.url,
        order: cat.order ?? index,
      }));
      await FeaturedCategory.insertMany(docs);
    }

    const saved = await FeaturedCategory.find().sort({ order: 1 }).lean();
    return NextResponse.json(saved);
  } catch (error) {
    console.error("Admin PUT /featured-categories failed:", error);
    return NextResponse.json(
      { message: "Failed to save featured categories" },
      { status: 500 }
    );
  }
}


