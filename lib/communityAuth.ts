import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import User from "@/models/User";

export type CommunityUser = { _id: mongoose.Types.ObjectId; name?: string; email: string };

function pickUserId(
  body: Record<string, unknown> | null,
  req: NextRequest
): string | null {
  const fromBody =
    body && typeof body.userId === "string" ? (body.userId as string).trim() : "";
  const fromQuery = req.nextUrl.searchParams.get("userId")?.trim() || "";
  const fromHeader = req.headers.get("x-user-id")?.trim() || "";
  const id = fromBody || fromQuery || fromHeader;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) return null;
  return id;
}

/** Resolves logged-in user the same way as wishlist (userId in body/query/header). */
export async function requireCommunityUser(
  req: NextRequest,
  body: Record<string, unknown> | null | undefined
): Promise<CommunityUser | null> {
  const userId = pickUserId(body ?? null, req);
  if (!userId) return null;
  await connectDB();
  const user = await User.findById(userId).select("_id name email").lean();
  if (!user) return null;
  return {
    _id: user._id as mongoose.Types.ObjectId,
    name: (user as { name?: string }).name,
    email: (user as { email: string }).email,
  };
}

export function optionalUserId(req: NextRequest): string | null {
  return pickUserId(null, req);
}
