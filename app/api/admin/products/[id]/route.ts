import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

interface RouteParams {
  params: {
    id: string;
  };
}

// NOTE: Add proper admin authentication/authorization here before using in production.

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const product = await Product.findById(params.id).lean();

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Admin GET /products/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const body = await req.json();

    const product = await Product.findByIdAndUpdate(
      params.id,
      {
        name: body.name,
        price: body.price,
        currency: body.currency,
        inStock: body.inStock,
        description: body.description,
        image: body.image,
        category: body.category,
      },
      { new: true }
    ).lean();

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Admin PUT /products/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const deleted = await Product.findByIdAndDelete(params.id).lean();

    if (!deleted) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin DELETE /products/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    );
  }
}


