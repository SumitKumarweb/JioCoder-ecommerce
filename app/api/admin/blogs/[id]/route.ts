import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import "@/models/Product"; // ensure Product model is registered for populate

// NOTE: Add proper admin authentication/authorization here before using in production.

type BlogRouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: BlogRouteContext) {
  try {
    const { id } = await context.params;
    await connectDB();
    const blog = await Blog.findById(id)
      .populate({ path: "relatedProducts", select: "name price image slug _id", strictPopulate: false })
      .lean();

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    const b = blog as any;
    return NextResponse.json({
      ...b,
      id: b._id.toString(),
      relatedProducts: (b.relatedProducts || []).map((p: any) => ({
        id: p._id.toString(),
        name: p.name,
        price: p.price,
        image: p.image,
        slug: p.slug,
      })),
    });
  } catch (error) {
    console.error("Admin GET /blogs/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: BlogRouteContext) {
  try {
    const { id } = await context.params;
    await connectDB();
    const body = await req.json();

    const blog = await Blog.findByIdAndUpdate(
      id,
      {
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
      },
      { new: true }
    ).lean();

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ ...(blog as any), id: (blog as any)._id.toString() });
  } catch (error: any) {
    console.error("Admin PUT /blogs/[id] failed:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "A blog post with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, context: BlogRouteContext) {
  try {
    const { id } = await context.params;
    await connectDB();
    const deleted = await Blog.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin DELETE /blogs/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
