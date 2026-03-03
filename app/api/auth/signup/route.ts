import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
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

    // Check if user already exists
    let existing;
    try {
      existing = await User.findOne({ email: email.toLowerCase() });
    } catch (findError: any) {
      console.error("❌ Error finding user:", findError);
      return NextResponse.json(
        {
          message: "Error checking existing user",
          error: process.env.NODE_ENV === "development" ? findError.message : undefined,
        },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password before creating user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with hashed password
    let user;
    try {
      user = await User.create({
        email: email.toLowerCase(),
        password: hashedPassword, // Already hashed
        name: name || undefined,
      });
      console.log("✅ User created successfully:", user.email);
    } catch (createError: any) {
      console.error("❌ Error creating user:", createError);
      
      // Handle specific MongoDB errors
      if (createError.code === 11000) {
        return NextResponse.json(
          { message: "An account with this email already exists" },
          { status: 409 }
        );
      }
      
      if (createError.name === "ValidationError") {
        const validationErrors = Object.values(createError.errors)
          .map((e: any) => e.message)
          .join(", ");
        return NextResponse.json(
          { message: `Validation error: ${validationErrors}` },
          { status: 400 }
        );
      }
      
      throw createError;
    }

    // Never return the password hash
    const safeUser = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      { message: "Signup successful", user: safeUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Signup error:", error);
    console.error("Error details:", {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });
    
    // Provide more detailed error messages
    let errorMessage = "Failed to sign up";
    let statusCode = 500;
    
    if (error.code === 11000) {
      // MongoDB duplicate key error
      errorMessage = "An account with this email already exists";
      statusCode = 409;
    } else if (error.name === "ValidationError") {
      errorMessage = Object.values(error.errors)
        .map((e: any) => e.message)
        .join(", ");
      statusCode = 400;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      {
        message: errorMessage,
        error: process.env.NODE_ENV === "development" ? error.toString() : undefined,
        details: process.env.NODE_ENV === "development" ? {
          name: error?.name,
          code: error?.code,
          message: error?.message,
        } : undefined,
      },
      { status: statusCode }
    );
  }
}
