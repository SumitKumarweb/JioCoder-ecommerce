import { NextResponse } from "next/server";
import connectDB from "@/lib/db";

// Temporary in-memory product list to demonstrate backend wiring.
// Replace this with a real database or external API when ready.
const products = [
  {
    id: "1",
    name: "Gaming Monitor 27\"",
    price: 299.99,
    currency: "USD",
    inStock: true,
  },
  {
    id: "2",
    name: "Mechanical Keyboard RGB",
    price: 129.0,
    currency: "USD",
    inStock: true,
  },
  {
    id: "3",
    name: "Studio Headphones",
    price: 199.0,
    currency: "USD",
    inStock: false,
  },
];

export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // TODO: Replace with actual database query
    // Example: const products = await Product.find({});
    
    return NextResponse.json({ 
      products,
      database: "connected"
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch products",
        products: [], // Fallback to empty array
      },
      { status: 500 }
    );
  }
}


