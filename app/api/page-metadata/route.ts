import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PageMetadata from "@/models/PageMetadata";

// Public read-only API for page metadata
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

    // Return all metadata for public access (read-only)
    const all = await PageMetadata.find()
      .select("-noIndex -noFollow") // Exclude internal fields
      .sort({ path: 1 })
      .lean();
    
    return NextResponse.json(all);
  } catch (error) {
    console.error("GET /page-metadata failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch page metadata" },
      { status: 500 }
    );
  }
}

