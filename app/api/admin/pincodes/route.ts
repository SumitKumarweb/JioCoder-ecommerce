import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Pincode from "@/models/Pincode";

// NOTE: Add proper admin authentication/authorization here before using in production.

function normalizeCode(input: unknown): string {
  const code = String(input ?? "").trim();
  return code;
}

function isValidIndianPincode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

export async function GET() {
  try {
    await connectDB();
    const pincodes = await Pincode.find().sort({ updatedAt: -1 }).lean();
    return NextResponse.json(pincodes);
  } catch (error) {
    console.error("Admin GET /pincodes failed:", error);
    return NextResponse.json({ message: "Failed to fetch pincodes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const code = normalizeCode(body?.code);
    const enabled = body?.enabled ?? true;

    if (!isValidIndianPincode(code)) {
      return NextResponse.json({ message: "Invalid pincode" }, { status: 400 });
    }

    const created = await Pincode.findOneAndUpdate(
      { code },
      { $setOnInsert: { code }, $set: { enabled: Boolean(enabled) } },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Admin POST /pincodes failed:", error);
    return NextResponse.json({ message: "Failed to create pincode" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const code = normalizeCode(searchParams.get("code"));

    if (!isValidIndianPincode(code)) {
      return NextResponse.json({ message: "Invalid pincode" }, { status: 400 });
    }

    await Pincode.deleteOne({ code });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin DELETE /pincodes failed:", error);
    return NextResponse.json({ message: "Failed to delete pincode" }, { status: 500 });
  }
}

