import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CoderCommunityGroup from "@/models/CoderCommunityGroup";
import CoderGroupMember from "@/models/CoderGroupMember";
import { requireCommunityUser } from "@/lib/communityAuth";
import { slugifyCommunityName } from "@/lib/communitySlug";
import { saveCommunityGroupAvatar } from "@/lib/communityGroupUpload";

export async function GET() {
  try {
    await connectDB();
    const groups = await CoderCommunityGroup.find({}).sort({ updatedAt: -1 }).lean();
    const counts = await Promise.all(
      groups.map((g) => CoderGroupMember.countDocuments({ groupId: g._id }))
    );

    const mapped = groups.map((g, i) => ({
      id: g._id.toString(),
      name: g.name,
      slug: g.slug,
      description: g.description || "",
      avatarUrl: g.avatarUrl || undefined,
      whoCanPost: g.whoCanPost,
      memberCount: counts[i],
      creatorUserId: g.creatorUserId?.toString(),
      updatedAt: g.updatedAt,
    }));

    return NextResponse.json({ groups: mapped });
  } catch (e) {
    console.error("GET /api/community/groups", e);
    return NextResponse.json({ message: "Failed to list groups" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let name = "";
    let description = "";
    let avatarUrl: string | undefined;
    let user: Awaited<ReturnType<typeof requireCommunityUser>> = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      user = await requireCommunityUser(req, {
        userId: String(form.get("userId") || "").trim(),
      });
      name = String(form.get("name") || "").trim();
      description = String(form.get("description") || "").trim();
      const avatar = form.get("avatar");
      if (avatar && typeof avatar !== "string") {
        try {
          const saved = await saveCommunityGroupAvatar(avatar as File);
          avatarUrl = saved.url;
        } catch (fileErr: unknown) {
          const msg = fileErr instanceof Error ? fileErr.message : "Invalid avatar";
          return NextResponse.json({ message: msg }, { status: 400 });
        }
      }
    } else {
      const body = await req.json().catch(() => ({}));
      user = await requireCommunityUser(req, body);
      name = typeof body.name === "string" ? body.name.trim() : "";
      description = typeof body.description === "string" ? body.description.trim() : "";
    }

    if (!user) {
      return NextResponse.json({ message: "Login required (userId)" }, { status: 401 });
    }

    if (!name || name.length > 120) {
      return NextResponse.json({ message: "Group name required" }, { status: 400 });
    }

    await connectDB();

    let base = slugifyCommunityName(name) || "group";
    let slug = base;
    let n = 0;
    while (await CoderCommunityGroup.findOne({ slug }).select("_id").lean()) {
      slug = `${base}-${++n}`;
    }

    const group = await CoderCommunityGroup.create({
      name,
      slug,
      description: description.slice(0, 2000),
      ...(avatarUrl ? { avatarUrl } : {}),
      creatorUserId: user._id,
      whoCanPost: "all",
    });

    await CoderGroupMember.create({
      groupId: group._id,
      userId: user._id,
      role: "group_admin",
    });

    return NextResponse.json({
      ok: true,
      group: {
        id: group._id.toString(),
        name: group.name,
        slug: group.slug,
        description: group.description,
        avatarUrl: group.avatarUrl || undefined,
        whoCanPost: group.whoCanPost,
        memberCount: 1,
      },
    });
  } catch (e) {
    console.error("POST /api/community/groups", e);
    return NextResponse.json({ message: "Failed to create group" }, { status: 500 });
  }
}
