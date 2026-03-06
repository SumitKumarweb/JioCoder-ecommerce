import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SaleModalLead from "@/models/SaleModalLead";

// NOTE: Add proper admin authentication/authorization here before using in production.

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const source = (searchParams.get("source") || "").trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(200, Math.max(10, parseInt(searchParams.get("limit") || "50", 10) || 50));
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};
    if (source) query.source = source;
    if (q) query.email = { $regex: q, $options: "i" };

    const [items, total] = await Promise.all([
      SaleModalLead.find(query).sort({ lastSubmittedAt: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      SaleModalLead.countDocuments(query),
    ]);

    return NextResponse.json({ items, total, page, limit });
  } catch (error) {
    console.error("Admin GET /sale-modal-leads failed:", error);
    return NextResponse.json({ message: "Failed to fetch leads" }, { status: 500 });
  }
}


