import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Collection from "@/models\Collection";

// NOTE: Add proper admin authentication/authorization here before using in production.

export async function GET() {
  try {
    await connectDB();
    const collections = await Collection.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(collections);
  } catch (error) {
    console.error("Admin GET /collections failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const collection = await Collection.create({
      name: body.name,
      slug: body.slug,
      description: body.description,
      heroImage: body.heroImage,
      isFeatured: body.isFeatured ?? false,
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    console.error("Admin POST /collections failed:", error);
    return NextResponse.json(
      { message: "Failed to create collection" },
      { status: 500 }
    );
  }
}


