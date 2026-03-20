import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CoderCommunityGroup from "@/models/CoderCommunityGroup";
import CoderGroupMember from "@/models/CoderGroupMember";
import CoderGroupMessage from "@/models/CoderGroupMessage";

export async function GET() {
  try {
    await connectDB();
    const groups = await CoderCommunityGroup.find({}).sort({ updatedAt: -1 }).lean();

    const enriched = await Promise.all(
      groups.map(async (g) => {
        const [memberCount, messageCount] = await Promise.all([
          CoderGroupMember.countDocuments({ groupId: g._id }),
          CoderGroupMessage.countDocuments({ groupId: g._id }),
        ]);
        return {
          id: g._id.toString(),
          name: g.name,
          slug: g.slug,
          description: g.description || "",
          avatarUrl: g.avatarUrl || undefined,
          whoCanPost: g.whoCanPost,
          creatorUserId: g.creatorUserId?.toString(),
          memberCount,
          messageCount,
          createdAt: g.createdAt,
          updatedAt: g.updatedAt,
        };
      })
    );

    return NextResponse.json({ groups: enriched });
  } catch (e) {
    console.error("admin community groups", e);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
