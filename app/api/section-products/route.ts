import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SectionProduct from "@/models/SectionProduct";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const sectionType = searchParams.get("sectionType");

    const query: Record<string, unknown> = {};
    if (sectionType) {
      query.sectionType = sectionType;
    }

    const items = await SectionProduct.find(query)
      .populate("product")
      .sort({ sectionType: 1, order: 1 })
      .lean();

    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch section products:", error);
    return NextResponse.json(
      { message: "Failed to fetch section products" },
      { status: 500 }
    );
  }
}


