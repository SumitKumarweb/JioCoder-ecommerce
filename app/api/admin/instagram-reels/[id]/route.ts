import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import InstagramReel from "@/models/InstagramReel";

type ReelRouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: ReelRouteContext) {
  try {
    const { id } = await context.params;
    await connectDB();
    const reel = await InstagramReel.findById(id).lean();

    if (!reel) {
      return NextResponse.json({ message: "Reel not found" }, { status: 404 });
    }

    return NextResponse.json(reel);
  } catch (error) {
    console.error("Admin GET /instagram-reels/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch reel" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: ReelRouteContext) {
  try {
    const { id } = await context.params;
    await connectDB();
    const body = await req.json();

    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.instagramUrl !== undefined) updateData.instagramUrl = body.instagramUrl;
    if (body.thumbnailUrl !== undefined) updateData.thumbnailUrl = body.thumbnailUrl;
    if (body.username !== undefined) updateData.username = body.username;
    if (body.views !== undefined) updateData.views = body.views;
    if (body.likes !== undefined) updateData.likes = body.likes;
    if (body.comments !== undefined) updateData.comments = body.comments;
    if (body.shares !== undefined) updateData.shares = body.shares;
    if (body.postedAt !== undefined) updateData.postedAt = new Date(body.postedAt);
    if (body.status !== undefined) updateData.status = body.status;

    const reel = await InstagramReel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!reel) {
      return NextResponse.json({ message: "Reel not found" }, { status: 404 });
    }

    return NextResponse.json(reel);
  } catch (error: any) {
    console.error("Admin PUT /instagram-reels/[id] failed:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update reel" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, context: ReelRouteContext) {
  try {
    const { id } = await context.params;
    await connectDB();
    const deleted = await InstagramReel.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json({ message: "Reel not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin DELETE /instagram-reels/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to delete reel" },
      { status: 500 }
    );
  }
}

