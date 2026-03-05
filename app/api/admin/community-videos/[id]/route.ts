import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CommunityVideo from "@/models/CommunityVideo";

type VideoRouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: VideoRouteContext) {
  try {
    const { id } = await context.params;
    await connectDB();
    const video = await CommunityVideo.findById(id).lean();

    if (!video) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error("Admin GET /community-videos/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch video" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: VideoRouteContext) {
  try {
    const { id } = await context.params;
    await connectDB();
    const body = await req.json();

    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.videoUrl !== undefined) updateData.videoUrl = body.videoUrl;
    if (body.thumbnailUrl !== undefined) updateData.thumbnailUrl = body.thumbnailUrl;
    if (body.uploadedBy !== undefined) updateData.uploadedBy = body.uploadedBy;
    if (body.views !== undefined) updateData.views = body.views;
    if (body.likes !== undefined) updateData.likes = body.likes;
    if (body.status !== undefined) updateData.status = body.status;

    const video = await CommunityVideo.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!video) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error: any) {
    console.error("Admin PUT /community-videos/[id] failed:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update video" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, context: VideoRouteContext) {
  try {
    const { id } = await context.params;
    await connectDB();
    const deleted = await CommunityVideo.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin DELETE /community-videos/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to delete video" },
      { status: 500 }
    );
  }
}

