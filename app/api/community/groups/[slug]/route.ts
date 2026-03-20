import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CoderCommunityGroup from "@/models/CoderCommunityGroup";
import CoderGroupMember from "@/models/CoderGroupMember";
import { optionalUserId } from "@/lib/communityAuth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    await connectDB();
    const group = await CoderCommunityGroup.findOne({ slug: slug.toLowerCase() }).lean();
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    const memberCount = await CoderGroupMember.countDocuments({ groupId: group._id });

    let myRole: "member" | "group_admin" | null = null;
    const userId = optionalUserId(req);
    if (userId) {
      const m = await CoderGroupMember.findOne({ groupId: group._id, userId }).lean();
      if (m) myRole = m.role as "member" | "group_admin";
    }

    return NextResponse.json({
      group: {
        id: group._id.toString(),
        name: group.name,
        slug: group.slug,
        description: group.description || "",
        avatarUrl: group.avatarUrl || undefined,
        whoCanPost: group.whoCanPost,
        creatorUserId: group.creatorUserId?.toString(),
        memberCount,
        myRole,
        isMember: myRole !== null,
      },
    });
  } catch (e) {
    console.error("GET /api/community/groups/[slug]", e);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
