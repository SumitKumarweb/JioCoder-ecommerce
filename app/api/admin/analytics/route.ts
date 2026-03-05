import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AnalyticsEvent from "@/models/AnalyticsEvent";

// NOTE: Add proper admin authentication/authorization here before using in production.

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const daysStr = searchParams.get("days");
    const days = daysStr ? parseInt(daysStr, 10) || 30 : 30;

    const since = new Date();
    since.setDate(since.getDate() - days);

    const stats = await AnalyticsEvent.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: "$eventType",
          count: { $sum: 1 },
          lastAt: { $max: "$createdAt" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Admin GET /analytics failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const event = await AnalyticsEvent.create({
      eventType: body.eventType,
      source: body.source,
      payload: body.payload,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Admin POST /analytics failed:", error);
    return NextResponse.json(
      { message: "Failed to record event" },
      { status: 500 }
    );
  }
}


