import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CoderUserStatus from "@/models/CoderUserStatus";

export async function GET() {
  try {
    await connectDB();
    const now = new Date();
    const active = await CoderUserStatus.find({ expiresAt: { $gt: now } })
      .sort({ createdAt: -1 })
      .limit(200)
      .populate("userId", "name email")
      .lean();

    const mapped = active.map((s: any) => ({
      id: s._id.toString(),
      text: s.text,
      imageUrl: s.imageUrl,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      user: s.userId
        ? { id: s.userId._id?.toString?.(), name: s.userId.name, email: s.userId.email }
        : null,
    }));

    return NextResponse.json({ statuses: mapped });
  } catch (e) {
    console.error("admin statuses", e);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
