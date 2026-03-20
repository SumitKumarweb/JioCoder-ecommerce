import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CoderCommunityFeedPost from "@/models/CoderCommunityFeedPost";
import { requireCommunityUser } from "@/lib/communityAuth";
import { saveCommunityFeedImage } from "@/lib/communityFeedUpload";

function normalizeResourceUrl(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  try {
    const u = new URL(t);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

function mapPost(p: any) {
  return {
    id: p._id.toString(),
    body: p.body ?? "",
    code: p.code || undefined,
    resourceUrl: p.resourceUrl || undefined,
    imageUrl: p.imageUrl || undefined,
    createdAt: p.createdAt,
    user: p.userId
      ? {
          id: p.userId._id?.toString?.() || String(p.userId),
          name: p.userId.name,
          email: p.userId.email,
        }
      : null,
  };
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const limit = Math.min(50, Math.max(1, parseInt(req.nextUrl.searchParams.get("limit") || "30", 10)));
    const posts = await CoderCommunityFeedPost.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("userId", "name email")
      .lean();

    const mapped = posts.map((p: any) => mapPost(p));

    return NextResponse.json({ posts: mapped });
  } catch (e) {
    console.error("GET /api/community/feed", e);
    return NextResponse.json({ message: "Failed to load feed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let bodyText = "";
    let codeText = "";
    let resourceRaw = "";
    let imageUrl: string | undefined;
    let user: Awaited<ReturnType<typeof requireCommunityUser>> = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      user = await requireCommunityUser(req, {
        userId: String(form.get("userId") || "").trim(),
      });
      bodyText = String(form.get("body") || "").trim();
      codeText = String(form.get("code") || "").trim();
      resourceRaw = String(form.get("resourceUrl") || "").trim();

      const image = form.get("image");
      if (image && typeof image !== "string") {
        try {
          const saved = await saveCommunityFeedImage(image as File);
          imageUrl = saved.url;
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
      resourceRaw = typeof body.resourceUrl === "string" ? body.resourceUrl.trim() : "";
    }

    if (!user) {
      return NextResponse.json({ message: "Login required (userId)" }, { status: 401 });
    }

    if (bodyText.length > 10000 || codeText.length > 20000) {
      return NextResponse.json({ message: "Text or code is too long" }, { status: 400 });
    }

    const resourceUrl = normalizeResourceUrl(resourceRaw);
    if (resourceRaw && !resourceUrl) {
      return NextResponse.json({ message: "Resource URL must be a valid http(s) link" }, { status: 400 });
    }

    const hasBody = bodyText.length > 0;
    const hasCode = codeText.length > 0;
    const hasResource = Boolean(resourceUrl);
    const hasImage = Boolean(imageUrl);
    if (!hasBody && !hasCode && !hasResource && !hasImage) {
      return NextResponse.json(
        { message: "Add a message, code snippet, resource link, or image (any combination)" },
        { status: 400 }
      );
    }

    await connectDB();
    const doc = await CoderCommunityFeedPost.create({
      userId: user._id,
      body: bodyText,
      ...(hasCode ? { code: codeText } : {}),
      ...(resourceUrl ? { resourceUrl } : {}),
      ...(imageUrl ? { imageUrl } : {}),
    });

    const populated = await CoderCommunityFeedPost.findById(doc._id)
      .populate("userId", "name email")
      .lean();

    const fallbackUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    return NextResponse.json({
      ok: true,
      post: populated
        ? mapPost(populated)
        : mapPost({
            _id: doc._id,
            body: doc.body,
            code: doc.code,
            resourceUrl: doc.resourceUrl,
            imageUrl: doc.imageUrl,
            createdAt: doc.createdAt,
            userId: fallbackUser,
          }),
    });
  } catch (e) {
    console.error("POST /api/community/feed", e);
    return NextResponse.json({ message: "Failed to post" }, { status: 500 });
  }
}
