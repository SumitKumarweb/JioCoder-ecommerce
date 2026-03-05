import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

type PublicProductRouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: PublicProductRouteContext) {
  try {
    const { id } = await context.params;
    await connectDB();
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}


