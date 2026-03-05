import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

// Public products API for the main website (no admin-only fields here)
// Supports basic filtering via query params: ?category=&inStock=true
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const inStock = searchParams.get("inStock");

    const query: Record<string, unknown> = {};

    if (category) {
      query.category = category;
    }

    if (inStock === "true") {
      query.inStock = true;
    } else if (inStock === "false") {
      query.inStock = false;
    }

    const products = await Product.find(query).lean();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

