import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CommunityVideo from "@/models/CommunityVideo";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query: Record<string, unknown> = {};
    if (status) {
      query.status = status;
    }

    const videos = await CommunityVideo.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Admin GET /community-videos failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Validate required fields
    if (!body.title || !body.videoUrl) {
      return NextResponse.json(
        { message: "Title and video URL are required" },
        { status: 400 }
      );
    }

    const video = await CommunityVideo.create({
      title: body.title,
      description: body.description || "",
      videoUrl: body.videoUrl,
      thumbnailUrl: body.thumbnailUrl || "",
      uploadedBy: body.uploadedBy || "Admin",
      views: body.views || 0,
      likes: body.likes || 0,
      status: body.status || "published",
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error: any) {
    console.error("Admin POST /community-videos failed:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create video" },
      { status: 500 }
    );
  }
}

