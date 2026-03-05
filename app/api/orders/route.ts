import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Validate required fields
    if (!body.customerName || !body.customerEmail || !body.items || !body.total) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create order
    const order = await Order.create({
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      items: body.items.map((item: any) => ({
        product: item.productId || null,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      status: body.status || "PENDING",
      paymentStatus: body.paymentStatus || "PENDING",
      total: body.total,
      currency: body.currency || "INR",
      paymentId: body.paymentId,
      paymentMethod: body.paymentMethod,
      shippingAddress: body.shippingAddress,
    });

    // Populate product references
    const populated = await Order.findById(order._id)
      .populate("items.product")
      .lean();

    return NextResponse.json(populated, { status: 201 });
  } catch (error: any) {
    console.error("POST /orders failed:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

