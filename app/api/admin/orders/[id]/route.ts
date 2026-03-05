import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

interface RouteParams {
  params: {
    id: string;
  };
}

// NOTE: Add proper admin authentication/authorization here before using in production.

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const order = await Order.findById(params.id)
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

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const body = await req.json();

    const order = await Order.findByIdAndUpdate(
      params.id,
      {
        status: body.status,
        paymentId: body.paymentId,
        paymentMethod: body.paymentMethod,
        shippingAddress: body.shippingAddress,
      },
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

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const deleted = await Order.findByIdAndDelete(params.id).lean();

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


