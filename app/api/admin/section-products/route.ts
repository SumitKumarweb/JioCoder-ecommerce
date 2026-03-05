import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SectionProduct from "@/models/SectionProduct";

// NOTE: Add proper admin authentication/authorization here before using in production.

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
    console.error("Admin GET /section-products failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch section products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const item = await SectionProduct.create({
      product: body.productId,
      sectionType: body.sectionType,
      order: body.order ?? 0,
    });

    const populated = await item.populate("product");

    return NextResponse.json(populated, { status: 201 });
  } catch (error) {
    console.error("Admin POST /section-products failed:", error);
    return NextResponse.json(
      { message: "Failed to create section product" },
      { status: 500 }
    );
  }
}


