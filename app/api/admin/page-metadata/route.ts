import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PageMetadata from "@/models/PageMetadata";

// NOTE: Add proper admin authentication/authorization here before using in production.

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    if (path) {
      const meta = await PageMetadata.findOne({ path }).lean();
      if (!meta) {
        return NextResponse.json(
          { message: "Metadata not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(meta);
    }

    const all = await PageMetadata.find().sort({ path: 1 }).lean();
    return NextResponse.json(all);
  } catch (error) {
    console.error("Admin GET /page-metadata failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch page metadata" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const meta = await PageMetadata.create({
      path: body.path,
      title: body.title,
      description: body.description,
      keywords: body.keywords,
      ogImage: body.ogImage,
      noIndex: body.noIndex ?? false,
      noFollow: body.noFollow ?? false,
    });

    return NextResponse.json(meta, { status: 201 });
  } catch (error) {
    console.error("Admin POST /page-metadata failed:", error);
    return NextResponse.json(
      { message: "Failed to create page metadata" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const meta = await PageMetadata.findOneAndUpdate(
      { path: body.path },
      {
        title: body.title,
        description: body.description,
        keywords: body.keywords,
        ogImage: body.ogImage,
        noIndex: body.noIndex,
        noFollow: body.noFollow,
      },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json(meta);
  } catch (error) {
    console.error("Admin PUT /page-metadata failed:", error);
    return NextResponse.json(
      { message: "Failed to upsert page metadata" },
      { status: 500 }
    );
  }
}


