import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

// NOTE: Add proper admin authentication/authorization here before using in production.

type OrderRouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: OrderRouteContext) {
  try {
    const { id } = await context.params;
    await connectDB();
    const order = await Order.findById(id)
      .populate("user", "email name")
      .populate("items.product")
      .lean();

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Admin GET /orders/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: OrderRouteContext) {
  try {
    const { id } = await context.params;
    await connectDB();
    const body = await req.json();

    const updateData: any = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.paymentStatus !== undefined) updateData.paymentStatus = body.paymentStatus;
    if (body.paymentId !== undefined) updateData.paymentId = body.paymentId;
    if (body.paymentMethod !== undefined) updateData.paymentMethod = body.paymentMethod;
    if (body.shippingAddress !== undefined) updateData.shippingAddress = body.shippingAddress;

    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .populate("user", "email name")
      .populate("items.product")
      .lean();

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Admin PUT /orders/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, context: OrderRouteContext) {
  try {
    const { id } = await context.params;
    await connectDB();
    const deleted = await Order.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin DELETE /orders/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to delete order" },
      { status: 500 }
    );
  }
}


