import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CoderCommunityGroup from "@/models/CoderCommunityGroup";
import CoderGroupMember from "@/models/CoderGroupMember";
import CoderGroupMessage from "@/models/CoderGroupMessage";
import { requireCommunityUser } from "@/lib/communityAuth";
import { saveGroupChatImage } from "@/lib/communityGroupChatUpload";
import { createGroupChatMessage, dtoToWire } from "@/lib/communityGroupMessageService";
import { broadcastGroupChatMessage } from "@/lib/groupChatSocket";

async function getGroupBySlug(slug: string) {
  return CoderCommunityGroup.findOne({ slug: slug.toLowerCase() }).lean();
}

function mapMessage(m: any) {
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

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const user = await requireCommunityUser(req, null);
    const userId = user?._id?.toString() || req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ message: "Login required to read messages" }, { status: 401 });
    }

    await connectDB();
    const group = await getGroupBySlug(slug);
    if (!group) return NextResponse.json({ message: "Group not found" }, { status: 404 });

    const member = await CoderGroupMember.findOne({ groupId: group._id, userId }).lean();
    if (!member) {
      return NextResponse.json({ message: "Join the group to read messages" }, { status: 403 });
    }

    const limit = Math.min(100, Math.max(1, parseInt(req.nextUrl.searchParams.get("limit") || "50", 10)));
    const messages = await CoderGroupMessage.find({ groupId: group._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("userId", "name email")
      .lean();

    const mapped = messages.reverse().map((m: any) => mapMessage(m));

    return NextResponse.json({ messages: mapped });
  } catch (e) {
    console.error("GET group messages", e);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const contentType = req.headers.get("content-type") || "";
    let bodyText = "";
    let codeText = "";
    let imageUrl: string | undefined;
    let user: Awaited<ReturnType<typeof requireCommunityUser>> = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      user = await requireCommunityUser(req, {
        userId: String(form.get("userId") || "").trim(),
      });
      bodyText = String(form.get("body") || "").trim();
      codeText = String(form.get("code") || "").trim();
      const image = form.get("image");
      if (image && typeof image !== "string") {
        try {
          imageUrl = (await saveGroupChatImage(image as File)).url;
        } catch (fileErr: unknown) {
          const msg = fileErr instanceof Error ? fileErr.message : "Invalid image";
          return NextResponse.json({ message: msg }, { status: 400 });
        }
      }
    } else {
      const body = await req.json().catch(() => ({}));
      user = await requireCommunityUser(req, body);
      bodyText = typeof body.body === "string" ? body.body.trim() : "";
      codeText = typeof body.code === "string" ? body.code.trim() : "";
    }

    if (!user) {
      return NextResponse.json({ message: "Login required (userId)" }, { status: 401 });
    }

    const created = await createGroupChatMessage({
      slug,
      userId: user._id.toString(),
      body: bodyText,
      code: codeText,
      imageUrl,
    });

    if (!created.ok) {
      return NextResponse.json({ message: created.error }, { status: created.status });
    }

    const wire = dtoToWire(created.dto);
    broadcastGroupChatMessage(slug, wire);

    return NextResponse.json({
      ok: true,
      message: wire,
    });
  } catch (e) {
    console.error("POST group message", e);
    return NextResponse.json({ message: "Failed to send" }, { status: 500 });
  }
}
