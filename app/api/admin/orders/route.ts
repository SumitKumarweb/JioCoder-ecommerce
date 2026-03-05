import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

// NOTE: Add proper admin authentication/authorization here before using in production.

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query: Record<string, unknown> = {};
    if (status) {
      query.status = status.toUpperCase();
    }

    const orders = await Order.find(query)
      .populate("user", "email name")
      .populate("items.product")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Admin GET /orders failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const order = await Order.create({
      user: body.userId,
      items: body.items?.map((item: any) => ({
        product: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      status: body.status || "PENDING",
      total: body.total,
      currency: body.currency || "INR",
      paymentId: body.paymentId,
      paymentMethod: body.paymentMethod,
      shippingAddress: body.shippingAddress,
    });

    const populated = await order
      .populate("user", "email name")
      .populate("items.product");

    return NextResponse.json(populated, { status: 201 });
  } catch (error) {
    console.error("Admin POST /orders failed:", error);
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    );
  }
}


