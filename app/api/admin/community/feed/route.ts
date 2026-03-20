import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CoderCommunityFeedPost from "@/models/CoderCommunityFeedPost";

export async function GET() {
  try {
    await connectDB();
    const posts = await CoderCommunityFeedPost.find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .populate("userId", "name email")
      .lean();

    const mapped = posts.map((p: any) => ({
      id: p._id.toString(),
      body: p.body ?? "",
      code: p.code || undefined,
      resourceUrl: p.resourceUrl || undefined,
      imageUrl: p.imageUrl || undefined,
      createdAt: p.createdAt,
      user: p.userId
        ? { id: p.userId._id?.toString?.(), name: p.userId.name, email: p.userId.email }
        : null,
    }));

    return NextResponse.json({ posts: mapped });
  } catch (e) {
    console.error("admin community feed", e);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
