import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CoderCommunityGroup from "@/models/CoderCommunityGroup";
import CoderGroupMember from "@/models/CoderGroupMember";
import { requireCommunityUser } from "@/lib/communityAuth";
import type { WhoCanPost } from "@/models/CoderCommunityGroup";

export async function PATCH(
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
    if (!group) return NextResponse.json({ message: "Group not found" }, { status: 404 });

    const member = await CoderGroupMember.findOne({ groupId: group._id, userId: user._id }).lean();
    const isCreator = group.creatorUserId.toString() === user._id.toString();
    const isGroupAdmin = member?.role === "group_admin";
    if (!isGroupAdmin && !isCreator) {
      return NextResponse.json({ message: "Only group admins can change settings" }, { status: 403 });
    }

    if (typeof body.name === "string" && body.name.trim()) {
      group.name = body.name.trim().slice(0, 120);
    }
    if (typeof body.description === "string") {
      group.description = body.description.trim().slice(0, 2000);
    }
    if (body.whoCanPost === "all" || body.whoCanPost === "admins") {
      group.whoCanPost = body.whoCanPost as WhoCanPost;
    }

    await group.save();

    return NextResponse.json({
      ok: true,
      group: {
        id: group._id.toString(),
        name: group.name,
        slug: group.slug,
        description: group.description,
        whoCanPost: group.whoCanPost,
      },
    });
  } catch (e) {
    console.error("PATCH group settings", e);
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }
}
