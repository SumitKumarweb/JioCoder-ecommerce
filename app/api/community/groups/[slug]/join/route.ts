import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CoderCommunityGroup from "@/models/CoderCommunityGroup";
import CoderGroupMember from "@/models/CoderGroupMember";
import { requireCommunityUser } from "@/lib/communityAuth";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await req.json().catch(() => ({}));
    const user = await requireCommunityUser(req, body);
    if (!user) {
      return NextResponse.json({ message: "Login required (userId)" }, { status: 401 });
    }

    await connectDB();
    const group = await CoderCommunityGroup.findOne({ slug: slug.toLowerCase() });
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    await CoderGroupMember.findOneAndUpdate(
      { groupId: group._id, userId: user._id },
      { $setOnInsert: { role: "member", joinedAt: new Date() } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST join", e);
    return NextResponse.json({ message: "Failed to join" }, { status: 500 });
  }
}
