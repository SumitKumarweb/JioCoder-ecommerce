import mongoose from "mongoose";
import connectDB from "@/lib/db";
import CoderCommunityGroup from "@/models/CoderCommunityGroup";
import CoderGroupMember from "@/models/CoderGroupMember";
import CoderGroupMessage from "@/models/CoderGroupMessage";

export type GroupChatMessageDTO = {
  id: string;
  body: string;
  code?: string;
  imageUrl?: string;
  createdAt: Date;
  user: { id: string; name?: string; email: string } | null;
};

function mapMessageDoc(m: any): GroupChatMessageDTO {
  return {
    id: m._id.toString(),
    body: m.body ?? "",
    code: m.code || undefined,
    imageUrl: m.imageUrl || undefined,
    createdAt: m.createdAt,
    user: m.userId
      ? {
          id: m.userId._id?.toString?.(),
          name: m.userId.name,
          email: m.userId.email,
        }
      : null,
  };
}

export type CreateGroupMessageResult =
  | { ok: true; dto: GroupChatMessageDTO }
  | { ok: false; error: string; status: number };

/**
 * Persists a group chat message (same rules as REST). Used by API route + Socket.IO.
 */
export async function createGroupChatMessage(params: {
  slug: string;
  userId: string;
  body: string;
  code: string;
  imageUrl?: string;
}): Promise<CreateGroupMessageResult> {
  const { slug, userId, body: bodyText, code: codeText, imageUrl } = params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return { ok: false, error: "Invalid user", status: 401 };
  }

  if (bodyText.length > 5000 || codeText.length > 15000) {
    return { ok: false, error: "Message or code is too long", status: 400 };
  }

  const hasBody = bodyText.length > 0;
  const hasCode = codeText.length > 0;
  const hasImage = Boolean(imageUrl);
  if (!hasBody && !hasCode && !hasImage) {
    return {
      ok: false,
      error: "Add a message, code snippet, or image (at least one)",
      status: 400,
    };
  }

  await connectDB();
  const group = await CoderCommunityGroup.findOne({ slug: slug.toLowerCase() });
  if (!group) {
    return { ok: false, error: "Group not found", status: 404 };
  }

  const uid = new mongoose.Types.ObjectId(userId);
  const member = await CoderGroupMember.findOne({ groupId: group._id, userId: uid }).lean();
  if (!member) {
    return { ok: false, error: "Join the group to send messages", status: 403 };
  }

  if (group.whoCanPost === "admins" && member.role !== "group_admin") {
    return { ok: false, error: "Only group admins can post here", status: 403 };
  }

  const msg = await CoderGroupMessage.create({
    groupId: group._id,
    userId: uid,
    body: bodyText,
    ...(hasCode ? { code: codeText } : {}),
    ...(imageUrl ? { imageUrl } : {}),
  });

  const populated = await CoderGroupMessage.findById(msg._id)
    .populate("userId", "name email")
    .lean();

  if (!populated) {
    return {
      ok: true,
      dto: {
        id: msg._id.toString(),
        body: msg.body ?? "",
        code: msg.code || undefined,
        imageUrl: msg.imageUrl || undefined,
        createdAt: msg.createdAt,
        user: { id: userId, name: undefined, email: "" },
      },
    };
  }

  return { ok: true, dto: mapMessageDoc(populated) };
}

export function dtoToWire(m: GroupChatMessageDTO) {
  const created =
    m.createdAt instanceof Date ? m.createdAt.toISOString() : String(m.createdAt);
  return {
    id: m.id,
    body: m.body,
    code: m.code,
    imageUrl: m.imageUrl,
    createdAt: created,
    user: m.user,
  };
}
