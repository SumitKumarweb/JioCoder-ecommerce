import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    try {
      await connectDB();
      console.log("✅ Database connected successfully");
    } catch (dbError: any) {
      console.error("❌ Database connection failed:", dbError);
      return NextResponse.json(
        {
          message: "Database connection failed. Please check your MongoDB connection.",
          error: process.env.NODE_ENV === "development" ? dbError.message : undefined,
          hint: "Make sure your IP is whitelisted in MongoDB Atlas",
        },
        { status: 503 }
      );
    }

    // Find user
    let user;
    try {
      user = await User.findOne({ email: email.toLowerCase() });
    } catch (findError: any) {
      console.error("❌ Error finding user:", findError);
      return NextResponse.json(
        {
          message: "Error checking user credentials",
          error: process.env.NODE_ENV === "development" ? findError.message : undefined,
        },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare password
    let isMatch;
    try {
      isMatch = await user.comparePassword(password);
    } catch (compareError: any) {
      console.error("❌ Error comparing password:", compareError);
      return NextResponse.json(
        {
          message: "Error verifying password",
          error: process.env.NODE_ENV === "development" ? compareError.message : undefined,
        },
        { status: 500 }
      );
    }

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Never return the password hash
    const safeUser = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };

    console.log("✅ Login successful for:", user.email);
    return NextResponse.json(
      { message: "Login successful", user: safeUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Login error:", error);
    console.error("Error details:", {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });
    
    return NextResponse.json(
      {
        message: "Failed to log in",
        error: process.env.NODE_ENV === "development" ? error.toString() : undefined,
        details: process.env.NODE_ENV === "development" ? {
          name: error?.name,
          code: error?.code,
          message: error?.message,
        } : undefined,
      },
      { status: 500 }
    );
  }
}


