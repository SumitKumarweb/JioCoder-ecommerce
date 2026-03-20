import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import CoderUserStatus from "@/models/CoderUserStatus";
import User from "@/models/User";
import { requireCommunityUser } from "@/lib/communityAuth";
import { saveCommunityStatusImage } from "@/lib/communityStatusUpload";

const HOURS_24_MS = 24 * 60 * 60 * 1000;

type StoryUploadGate = { canUpload: boolean; nextAllowedAt?: string };

async function resolveLastStoryUploadAt(
  userId: mongoose.Types.ObjectId
): Promise<Date | null> {
  const u = await User.findById(userId).select("lastCommunityStatusUploadedAt").lean();
  const fromUser = u?.lastCommunityStatusUploadedAt
    ? new Date(u.lastCommunityStatusUploadedAt)
    : null;
  if (fromUser && !Number.isNaN(fromUser.getTime())) return fromUser;

  const latest = await CoderUserStatus.findOne({ userId })
    .sort({ createdAt: -1 })
    .select("createdAt")
    .lean();
  if (latest?.createdAt) {
    const d = new Date(latest.createdAt);
    await User.findByIdAndUpdate(userId, { lastCommunityStatusUploadedAt: d });
    return d;
  }
  return null;
}

function storyUploadGateFromLast(lastUpload: Date, now: Date): StoryUploadGate {
  const nextAllowedAt = new Date(lastUpload.getTime() + HOURS_24_MS);
  if (now.getTime() >= nextAllowedAt.getTime()) {
    return { canUpload: true };
  }
  return { canUpload: false, nextAllowedAt: nextAllowedAt.toISOString() };
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const now = new Date();
    const statuses = await CoderUserStatus.find({ expiresAt: { $gt: now } })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("userId", "name email")
      .lean();

    const mapped = statuses.map((s: any) => ({
      id: s._id.toString(),
      text: s.text,
      imageUrl: s.imageUrl,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      user: s.userId
        ? {
            id: s.userId._id?.toString?.(),
            name: s.userId.name,
            email: s.userId.email,
          }
        : null,
    }));

    let myStoryUpload: StoryUploadGate | undefined;
    const qUid = req.nextUrl.searchParams.get("userId")?.trim();
    if (qUid && mongoose.Types.ObjectId.isValid(qUid)) {
      const exists = await User.findById(qUid).select("_id").lean();
      if (exists?._id) {
        const last = await resolveLastStoryUploadAt(exists._id as mongoose.Types.ObjectId);
        myStoryUpload = last ? storyUploadGateFromLast(last, now) : { canUpload: true };
      }
    }

    return NextResponse.json({
      statuses: mapped,
      ...(myStoryUpload ? { myStoryUpload } : {}),
    });
  } catch (e) {
    console.error("GET status", e);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let text = "";
    let imageUrl: string | undefined;
    let user: Awaited<ReturnType<typeof requireCommunityUser>> = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      user = await requireCommunityUser(req, {
        userId: String(form.get("userId") || "").trim(),
      });
      text = String(form.get("text") || "").trim();

      const image = form.get("image");
      if (image && typeof image !== "string") {
        try {
          const saved = await saveCommunityStatusImage(image as File);
          imageUrl = saved.url;
        } catch (fileErr: unknown) {
          const msg = fileErr instanceof Error ? fileErr.message : "Invalid image";
          return NextResponse.json({ message: msg }, { status: 400 });
        }
      }
    } else {
      const body = await req.json().catch(() => ({}));
      user = await requireCommunityUser(req, body);
      text = typeof body.text === "string" ? body.text.trim() : "";
      // Photo must be uploaded via multipart; JSON no longer accepts imageUrl for new posts
    }

    if (!user) {
      return NextResponse.json({ message: "Login required (userId)" }, { status: 401 });
    }

    if (!text || text.length > 280) {
      return NextResponse.json({ message: "Status text required (max 280 chars)" }, { status: 400 });
    }

    await connectDB();
    const now = new Date();
    const lastUpload = await resolveLastStoryUploadAt(user._id);
    if (lastUpload) {
      const gate = storyUploadGateFromLast(lastUpload, now);
      if (!gate.canUpload) {
        return NextResponse.json(
          {
            message:
              "You can upload only one story every 24 hours. Try again after the time shown below.",
            nextAllowedAt: gate.nextAllowedAt,
          },
          { status: 429 }
        );
      }
    }

    await CoderUserStatus.deleteMany({ userId: user._id });

    const doc = await CoderUserStatus.create({
      userId: user._id,
      text,
      imageUrl,
      createdAt: now,
      expiresAt: new Date(now.getTime() + HOURS_24_MS),
    });

    await User.findByIdAndUpdate(user._id, { lastCommunityStatusUploadedAt: now });

    const nextAllowedAt = new Date(now.getTime() + HOURS_24_MS).toISOString();

    return NextResponse.json({
      ok: true,
      status: {
        id: doc._id.toString(),
        text: doc.text,
        imageUrl: doc.imageUrl,
        createdAt: doc.createdAt,
        expiresAt: doc.expiresAt,
        user: { id: user._id.toString(), name: user.name, email: user.email },
      },
      myStoryUpload: { canUpload: false, nextAllowedAt },
    });
  } catch (e) {
    console.error("POST status", e);
    return NextResponse.json({ message: "Failed to set status" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const user = await requireCommunityUser(req, body);
    if (!user) {
      return NextResponse.json({ message: "Login required (userId)" }, { status: 401 });
    }

    await connectDB();
    await CoderUserStatus.deleteMany({ userId: user._id });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE status", e);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
