import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PageMetadata from "@/models/PageMetadata";

// NOTE: Add proper admin authentication/authorization here before using in production.

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");
    const id = searchParams.get("id");

    if (id) {
      const meta = await PageMetadata.findById(id).lean();
      if (!meta) {
        return NextResponse.json(
          { message: "Metadata not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(meta);
    }

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

    // Validate required fields
    if (!body.path) {
      return NextResponse.json(
        { message: "Path is required" },
        { status: 400 }
      );
    }

    // Check if path already exists
    const existing = await PageMetadata.findOne({ path: body.path });
    if (existing) {
      return NextResponse.json(
        { message: "Metadata for this path already exists. Use PUT to update." },
        { status: 409 }
      );
    }

    const meta = await PageMetadata.create({
      path: body.path,
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
      metaKeywords: body.metaKeywords,
      ogTitle: body.ogTitle,
      ogDescription: body.ogDescription,
      ogImage: body.ogImage,
      canonicalUrl: body.canonicalUrl,
      noIndex: body.noIndex ?? false,
      noFollow: body.noFollow ?? false,
    });

    return NextResponse.json(meta, { status: 201 });
  } catch (error: any) {
    console.error("Admin POST /page-metadata failed:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create page metadata" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.path && !body.id) {
      return NextResponse.json(
        { message: "Path or ID is required" },
        { status: 400 }
      );
    }

    const query = body.id ? { _id: body.id } : { path: body.path };
    
    const updateData: any = {};
    if (body.metaTitle !== undefined) updateData.metaTitle = body.metaTitle;
    if (body.metaDescription !== undefined) updateData.metaDescription = body.metaDescription;
    if (body.metaKeywords !== undefined) updateData.metaKeywords = body.metaKeywords;
    if (body.ogTitle !== undefined) updateData.ogTitle = body.ogTitle;
    if (body.ogDescription !== undefined) updateData.ogDescription = body.ogDescription;
    if (body.ogImage !== undefined) updateData.ogImage = body.ogImage;
    if (body.canonicalUrl !== undefined) updateData.canonicalUrl = body.canonicalUrl;
    if (body.noIndex !== undefined) updateData.noIndex = body.noIndex;
    if (body.noFollow !== undefined) updateData.noFollow = body.noFollow;
    if (body.path !== undefined && !body.id) updateData.path = body.path;

    const meta = await PageMetadata.findOneAndUpdate(
      query,
      updateData,
      { new: true, upsert: true, runValidators: true }
    ).lean();

    return NextResponse.json(meta);
  } catch (error: any) {
    console.error("Admin PUT /page-metadata failed:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update page metadata" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const path = searchParams.get("path");

    if (!id && !path) {
      return NextResponse.json(
        { message: "ID or path is required" },
        { status: 400 }
      );
    }

    const query = id ? { _id: id } : { path: path };
    const meta = await PageMetadata.findOneAndDelete(query);

    if (!meta) {
      return NextResponse.json(
        { message: "Metadata not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Metadata deleted successfully", deleted: meta },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Admin DELETE /page-metadata failed:", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete page metadata" },
      { status: 500 }
    );
  }
}


