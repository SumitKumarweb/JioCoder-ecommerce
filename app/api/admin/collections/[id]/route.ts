import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Collection from "@/models\Collection";

interface RouteParams {
  params: {
    id: string;
  };
}

// NOTE: Add proper admin authentication/authorization here before using in production.

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const collection = await Collection.findById(params.id).lean();

    if (!collection) {
      return NextResponse.json(
        { message: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(collection);
  } catch (error) {
    console.error("Admin GET /collections/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const body = await req.json();

    const collection = await Collection.findByIdAndUpdate(
      params.id,
      {
        name: body.name,
        slug: body.slug,
        description: body.description,
        heroImage: body.heroImage,
        isFeatured: body.isFeatured,
      },
      { new: true }
    ).lean();

    if (!collection) {
      return NextResponse.json(
        { message: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(collection);
  } catch (error) {
    console.error("Admin PUT /collections/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to update collection" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const deleted = await Collection.findByIdAndDelete(params.id).lean();

    if (!deleted) {
      return NextResponse.json(
        { message: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin DELETE /collections/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to delete collection" },
      { status: 500 }
    );
  }
}


