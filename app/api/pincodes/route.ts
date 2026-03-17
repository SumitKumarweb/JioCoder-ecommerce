import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Pincode from "@/models/Pincode";

export async function GET() {
  try {
    await connectDB();

    const pincodes = await Pincode.find({ enabled: true })
      .select("code updatedAt")
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json(
      pincodes.map((p) => ({
        code: p.code,
        updatedAt: p.updatedAt,
      }))
    );
  } catch (error) {
    console.error("GET /api/pincodes failed:", error);
    return NextResponse.json({ message: "Failed to fetch pincodes" }, { status: 500 });
  }
}

