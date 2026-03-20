import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CareerJob from "@/models/CareerJob";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const domain = (searchParams.get("domain") || "").trim();
    const publishedOnly = searchParams.get("published") !== "false";

    const now = new Date();
    const query: Record<string, any> = {};
    if (publishedOnly) {
      query.published = true;
      query.$or = [{ expirationDateTime: { $exists: false } }, { expirationDateTime: { $gt: now } }];
    }
    if (domain) query.domain = domain;

    const jobs = await CareerJob.find(query)
      .sort({ createdAt: -1 })
      .select("title domain companyName description location minCTC maxCTC expirationDateTime published")
      .lean();

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("GET /api/career-jobs failed:", error);
    return NextResponse.json({ message: "Failed to fetch career jobs" }, { status: 500 });
  }
}

