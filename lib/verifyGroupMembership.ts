import mongoose from "mongoose";
import connectDB from "@/lib/db";
import CoderCommunityGroup from "@/models/CoderCommunityGroup";
import CoderGroupMember from "@/models/CoderGroupMember";

export async function verifyGroupMembership(
  slug: string,
  userId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return { ok: false, error: "Invalid user" };
  }

  await connectDB();
  const group = await CoderCommunityGroup.findOne({ slug: slug.toLowerCase() }).lean();
  if (!group) {
    return { ok: false, error: "Group not found" };
  }

  const member = await CoderGroupMember.findOne({
    groupId: group._id,
    userId: new mongoose.Types.ObjectId(userId),
  }).lean();

  if (!member) {
    return { ok: false, error: "Join the group to read messages" };
  }

  return { ok: true };
}
