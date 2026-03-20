import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import CoderCommunityGroup from "@/models/CoderCommunityGroup";
import CoderGroupMessage from "@/models/CoderGroupMessage";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    await connectDB();
    const group = await CoderCommunityGroup.findById(id).lean();
    if (!group) return NextResponse.json({ message: "Not found" }, { status: 404 });

    const limit = Math.min(500, Math.max(1, parseInt(req.nextUrl.searchParams.get("limit") || "200", 10)));
    const messages = await CoderGroupMessage.find({ groupId: group._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("userId", "name email")
      .lean();

    const mapped = messages.reverse().map((m: any) => ({
      id: m._id.toString(),
      body: m.body ?? "",
      code: m.code || undefined,
      imageUrl: m.imageUrl || undefined,
      createdAt: m.createdAt,
      user: m.userId
        ? { id: m.userId._id?.toString?.(), name: m.userId.name, email: m.userId.email }
        : null,
    }));

    return NextResponse.json({
      group: { id: group._id.toString(), name: group.name, slug: group.slug },
      messages: mapped,
    });
  } catch (e) {
    console.error("admin group messages", e);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
