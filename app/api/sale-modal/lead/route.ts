import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SaleModalLead from "@/models/SaleModalLead";

function isValidEmail(email: string) {
  // Simple pragmatic validation; avoid overly strict regex.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const emailRaw = typeof body.email === "string" ? body.email.trim() : "";
    const email = emailRaw.toLowerCase();
    const source = typeof body.source === "string" && body.source.trim() ? body.source.trim() : "sale-modal";
    const tags = Array.isArray(body.tags) ? body.tags.filter((t: any) => typeof t === "string" && t.trim()).map((t: string) => t.trim()) : ["sale-modal"];
    const pagePath = typeof body.pagePath === "string" ? body.pagePath.slice(0, 512) : undefined;
    const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 512) : undefined;
    const userAgent = typeof body.userAgent === "string" ? body.userAgent.slice(0, 512) : undefined;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ message: "Invalid email" }, { status: 400 });
    }

    await connectDB();

    const lead = await SaleModalLead.findOneAndUpdate(
      { email, source },
      {
        $set: {
          tags: tags.length ? tags : ["sale-modal"],
          pagePath,
          referrer,
          userAgent,
          lastSubmittedAt: new Date(),
        },
        $inc: { submissionCount: 1 },
        $setOnInsert: { email, source },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({ ok: true, leadId: lead?._id?.toString?.() });
  } catch (error) {
    console.error("POST /sale-modal/lead failed:", error);
    return NextResponse.json({ ok: false, message: "Failed to submit" }, { status: 500 });
  }
}


