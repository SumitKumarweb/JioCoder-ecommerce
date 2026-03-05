import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

type PublicProductRouteContext = { params: Promise<{ id: string }> };

/** Convert a product name into a URL-friendly slug */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper function to check if MongoDB connection is ready
function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

// Helper function to retry database operations
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Check connection health before each attempt
      if (!isConnected()) {
        console.log(`[Product API] Connection not ready, reconnecting... (attempt ${attempt})`);
        // Reset cached connection to force reconnection
        if (global.mongoose) {
          global.mongoose.conn = null;
          global.mongoose.promise = null;
        }
        await connectDB();
      }
      
      return await operation();
    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries;
      const isConnectionError = 
        error?.name === 'MongoServerError' ||
        error?.name === 'MongoNetworkError' ||
        error?.message?.includes('connection') ||
        error?.message?.includes('timeout');

      if (isLastAttempt) {
        throw error;
      }

      if (isConnectionError) {
        console.warn(`[Product API] Connection error on attempt ${attempt}, retrying in ${delay}ms...`);
        // Reset connection cache on connection errors
        if (global.mongoose) {
          global.mongoose.conn = null;
          global.mongoose.promise = null;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        // Non-connection errors, don't retry
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
}

export async function GET(_req: NextRequest, context: PublicProductRouteContext) {
  try {
    const { id } = await context.params;
    
    // Connect to database with retry logic
    try {
      await connectDB();
    } catch (dbError: any) {
      console.error("[Product API] Database connection failed:", dbError?.message || dbError);
      return NextResponse.json(
        { message: "Service temporarily unavailable. Please try again." },
        { status: 503 }
      );
    }

    // Retry the product lookup operation
    let product: any = await retryOperation(async () => {
      // Look up by slug first; fall back to MongoDB ObjectId for backwards compatibility
      if (mongoose.isValidObjectId(id)) {
        return await Product.findOne({ $or: [{ slug: id }, { _id: id }] }).lean();
      } else {
        return await Product.findOne({ slug: id }).lean();
      }
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Auto-generate and save slug for old products that don't have one yet
    if (!product.slug) {
      try {
        const baseSlug = generateSlug(product.name);
        // Ensure uniqueness by checking for existing slugs with same base
        const existingCount = await Product.countDocuments({
          slug: new RegExp(`^${baseSlug}(-\\d+)?$`),
          _id: { $ne: product._id },
        });
        const slug = existingCount > 0 ? `${baseSlug}-${existingCount + 1}` : baseSlug;

        // Save slug to DB so future lookups work by slug (with retry)
        await retryOperation(async () => {
          await Product.findByIdAndUpdate(product._id, { $set: { slug } });
        });
        product = { ...product, slug };
      } catch (slugError) {
        // If slug generation fails, continue without it
        console.warn("[Product API] Failed to generate/save slug:", slugError);
      }
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("[Product API] Failed to fetch product:", error);
    console.error("[Product API] Error details:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });
    
    // Return appropriate error based on error type
    if (error?.name === 'MongoNetworkError' || error?.message?.includes('connection')) {
      return NextResponse.json(
        { message: "Database connection error. Please try again." },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}


