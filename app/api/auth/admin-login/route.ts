import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

function getAdminToken() {
  const token = (
    process.env.ADMIN_LOGIN_TOKEN ||
    process.env.NEXT_PUBLIC_ADMIN_LOGIN_TOKEN
  )?.trim();
  return token;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password.trim() : "";
    const token = typeof body.token === "string" ? body.token.trim() : "";

    if (!email || !password || !token) {
      return NextResponse.json(
        { message: "Email, password and token are required" },
        { status: 400 }
      );
    }

    const expectedToken = getAdminToken();
    if (!expectedToken) {
      return NextResponse.json(
        { message: "Admin token is not configured on server" },
        { status: 500 }
      );
    }

    if (token !== expectedToken) {
      return NextResponse.json({ message: "Invalid admin token" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const sessionToken = `admin-${Buffer.from(
      `${user._id.toString()}:${Date.now()}`
    ).toString("base64url")}`;

    return NextResponse.json({
      message: "Login successful",
      token: sessionToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name || "Admin",
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ message: "Failed to log in" }, { status: 500 });
  }
}
