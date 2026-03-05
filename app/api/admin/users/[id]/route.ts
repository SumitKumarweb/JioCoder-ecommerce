import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

// NOTE: Add proper admin authentication/authorization here before using in production.

type AdminUserRouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: AdminUserRouteContext) {
  try {
    const { id } = await context.params;
    await connectDB();
    const user = await User.findById(id).select("-password").lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Admin GET /users/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: AdminUserRouteContext) {
  try {
    const { id } = await context.params;
    await connectDB();
    const body = await req.json();

    const updateData: Record<string, unknown> = {
      email: body.email,
      name: body.name,
    };

    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .select("-password")
      .lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Admin PUT /users/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, context: AdminUserRouteContext) {
  try {
    const { id } = await context.params;
    await connectDB();
    const deleted = await User.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin DELETE /users/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}


