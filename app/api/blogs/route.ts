import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limitRaw = Number(searchParams.get("limit") || 12);
    const limit = Math.min(24, Math.max(1, limitRaw));
    const skip = (page - 1) * limit;

    const query = { published: true };

    const [rows, total] = await Promise.all([
      Blog.find(query)
        .sort({ publishedAt: -1, updatedAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .select("slug title description featuredImage category readTime date isFeatured _id")
        .lean(),
      Blog.countDocuments(query),
    ]);

    const items = (rows as any[]).map((b) => ({
      id: b._id.toString(),
      slug: b.slug,
      title: b.title || "",
      description: b.description || b.title || "",
      featuredImage: b.featuredImage || "",
      category: b.category || "",
      readTime: b.readTime || "",
      date: b.date || "",
      isFeatured: Boolean(b.isFeatured),
    }));

    return NextResponse.json({ items, total, page, limit });
  } catch (error) {
    console.error("GET /api/blogs failed:", error);
    return NextResponse.json({ message: "Failed to fetch blogs" }, { status: 500 });
  }
}

