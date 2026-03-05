import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";

// NOTE: Add proper admin authentication/authorization here before using in production.

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(blogs);
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

    const blog = await .create({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      coverImage: body.coverImage,
      tags: body.tags,
      published: body.published ?? false,
      publishedAt: body.published ? new Date() : undefined,
      authorName: body.authorName,
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Admin POST /blogs failed:", error);
    return NextResponse.json(
      { message: "Failed to create blog" },
      { status: 500 }
    );
  }
}


