import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Coupon from "@/models/Coupon";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.customerName || !body.customerEmail || !body.items || !body.total) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    let userRef: mongoose.Types.ObjectId | undefined;
    if (body.userId && mongoose.isValidObjectId(String(body.userId))) {
      userRef = new mongoose.Types.ObjectId(String(body.userId));
    }

    const order = await Order.create({
      ...(userRef ? { user: userRef } : {}),
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      items: body.items.map((item: any) => {
        const isValidObjectId = mongoose.isValidObjectId(item.productId);
        return {
          product: isValidObjectId ? new mongoose.Types.ObjectId(item.productId) : undefined,
          productSlug: isValidObjectId ? undefined : (item.productId || undefined),
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        };
      }),
      status: body.status || "PENDING",
      paymentStatus: body.paymentStatus || "PENDING",
      total: body.total,
      currency: body.currency || "INR",
      paymentId: body.paymentId,
      paymentMethod: body.paymentMethod,
      shippingAddress: body.shippingAddress,
      couponCode: body.couponCode || undefined,
      couponDiscount: body.couponDiscount || 0,
    });

    // Increment coupon usage count if a coupon was applied
    if (body.couponCode) {
      await Coupon.findOneAndUpdate(
        { code: String(body.couponCode).toUpperCase() },
        { $inc: { usageCount: 1 } }
      );
    }

    return NextResponse.json(
      {
        _id: order._id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        total: order.total,
        status: order.status,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /orders failed:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const email = searchParams.get("email")?.trim().toLowerCase();

    const query: Record<string, unknown> = {};
    if (userId && mongoose.isValidObjectId(userId)) {
      query.user = userId;
    } else if (email) {
      query.customerEmail = email;
    } else {
      // Avoid returning every order when no filter is provided
      return NextResponse.json([]);
    }
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("GET /orders failed:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
