import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";

// NOTE: Add proper admin authentication/authorization here before using in production.

type BlogRouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: BlogRouteContext) {
  try {
    const { id } = await context.params;
    await connectDB();
    const blog = await Blog.findById(id).lean();

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
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
        excerpt: body.excerpt,
        content: body.content,
        coverImage: body.coverImage,
        tags: body.tags,
        published: body.published,
        publishedAt: body.published ? new Date() : undefined,
        authorName: body.authorName,
      },
      { new: true }
    ).lean();

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Admin PUT /blogs/[id] failed:", error);
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


