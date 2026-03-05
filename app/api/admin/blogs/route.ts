import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import "@/models/Product"; // ensure Product model is registered for populate

/** Convert a title into a URL-friendly slug */
function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// NOTE: Add proper admin authentication/authorization here before using in production.

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    // Fetch single blog by slug (with populated related products)
    if (slug) {
      // Case-insensitive slug search
      let blog = await Blog.findOne({
        slug: { $regex: new RegExp(`^${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
      })
        .populate({ path: "relatedProducts", select: "name price image slug _id", strictPopulate: false })
        .lean();

      // Fallback: if slug looks like a MongoDB ObjectId, try by _id
      if (!blog && /^[a-f\d]{24}$/i.test(slug)) {
        blog = await Blog.findById(slug)
          .populate({ path: "relatedProducts", select: "name price image slug _id", strictPopulate: false })
          .lean();
      }

      if (!blog) {
        return NextResponse.json({ message: "Blog not found" }, { status: 404 });
      }

      const b = blog as any;
      const resolvedSlug = b.slug || titleToSlug(b.title || b._id.toString());
      return NextResponse.json({
        ...b,
        id: b._id.toString(),
        slug: resolvedSlug,
        relatedProducts: (b.relatedProducts || []).map((p: any) => ({
          id: p._id.toString(),
          name: p.name,
          price: p.price,
          image: p.image,
          slug: p.slug,
        })),
      });
    }

    // Fetch all blogs (list view — no product population for performance)
    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
    const normalized = (blogs as any[]).map((b: any) => {
      // Auto-generate slug from title if the DB document doesn't have one
      const resolvedSlug = b.slug || titleToSlug(b.title || b._id.toString());
      return {
        ...b,
        id: b._id.toString(),
        slug: resolvedSlug,
      };
    });
    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Admin GET /blogs failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Validate required fields
    if (!body.title || !body.slug || !body.description || !body.category) {
      return NextResponse.json(
        { message: "Title, slug, description, and category are required" },
        { status: 400 }
      );
    }

    const blog = await Blog.create({
      title: body.title,
      slug: body.slug,
      description: body.description,
      summary: body.summary,
      category: body.category,
      subCategory: body.subCategory,
      featuredImage: body.featuredImage,
      images: body.images || [],
      videos: body.videos || [],
      content: body.content,
      author: body.author,
      date: body.date,
      readTime: body.readTime,
      tags: body.tags || [],
      isFeatured: body.isFeatured ?? false,
      relatedProducts: body.relatedProducts || [],
      published: body.published ?? false,
      publishedAt: body.published ? new Date() : undefined,
    });

    const obj = blog.toObject() as any;
    return NextResponse.json({ ...obj, id: obj._id.toString() }, { status: 201 });
  } catch (error: any) {
    console.error("Admin POST /blogs failed:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "A blog post with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Failed to create blog" },
      { status: 500 }
    );
  }
}
