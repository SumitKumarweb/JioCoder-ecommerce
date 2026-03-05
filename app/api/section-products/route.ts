import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SectionProduct from "@/models/SectionProduct";
import mongoose from "mongoose";

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
        console.log(`[SectionProducts API] Connection not ready, reconnecting... (attempt ${attempt})`);
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
        console.warn(`[SectionProducts API] Connection error on attempt ${attempt}, retrying in ${delay}ms...`);
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

export async function GET(req: NextRequest) {
  try {
    // Connect to database with retry logic
    try {
      await connectDB();
    } catch (dbError: any) {
      console.error("[SectionProducts API] Database connection failed:", dbError?.message || dbError);
      // Return empty array with diagnostic info in development
      const response: any = [];
      if (process.env.NODE_ENV === 'development') {
        (response as any).__debug = {
          error: "Database connection failed",
          message: dbError?.message || String(dbError)
        };
      }
      return NextResponse.json(response, { status: 200 });
    }

    const { searchParams } = new URL(req.url);
    const sectionType = searchParams.get("sectionType");

    console.log(`[SectionProducts API] Fetching products for sectionType: ${sectionType}`);

    const query: Record<string, unknown> = {};
    if (sectionType) {
      query.sectionType = sectionType;
    }

    // First, check if we have any SectionProduct documents at all (with retry)
    const totalCount = await retryOperation(async () => {
      return await SectionProduct.countDocuments(query);
    });

    console.log(`[SectionProducts API] Total SectionProduct documents found: ${totalCount}`);

    if (totalCount === 0) {
      console.warn(`[SectionProducts API] No SectionProduct documents found for sectionType: ${sectionType}`);
      // Return diagnostic info in development
      const response: any = [];
      if (process.env.NODE_ENV === 'development') {
        (response as any).__debug = {
          message: `No SectionProduct documents found for sectionType: ${sectionType}`,
          totalCount: 0,
          sectionType
        };
      }
      return NextResponse.json(response);
    }

    // Fetch items with populate, but handle cases where product might be null (with retry)
    const items = await retryOperation(async () => {
      return await SectionProduct.find(query)
        .populate({
          path: "product",
          // Don't throw error if product is missing, just return null
          options: { lean: true }
        })
        .sort({ sectionType: 1, order: 1 })
        .lean();
    });

    console.log(`[SectionProducts API] Found ${items.length} items after query`);

    // Log details about items with null products
    const itemsWithNullProducts = items.filter((item: any) => !item.product || !item.product._id);
    if (itemsWithNullProducts.length > 0) {
      console.warn(`[SectionProducts API] Found ${itemsWithNullProducts.length} items with null/missing products`);
      itemsWithNullProducts.forEach((item: any) => {
        console.warn(`[SectionProducts API] Item ${item._id} (sectionType: ${item.sectionType}) has null product reference: ${item.product}`);
      });
    }

    // Filter out items where product is null or undefined (broken references)
    const validItems = items.filter((item: any) => {
      const isValid = item.product && item.product._id;
      if (!isValid) {
        console.warn(`[SectionProducts API] Filtered out item ${item._id} - product is null or missing`);
      }
      return isValid;
    });

    console.log(`[SectionProducts API] Valid items after filtering: ${validItems.length}`);

    // If no valid items, return empty array with diagnostic info
    if (validItems.length === 0) {
      console.warn(`[SectionProducts API] No valid items found for sectionType: ${sectionType}`);
      const response: any = [];
      if (process.env.NODE_ENV === 'development') {
        (response as any).__debug = {
          message: `No valid items found for sectionType: ${sectionType}`,
          totalCount,
          itemsFound: items.length,
          itemsWithNullProducts: itemsWithNullProducts.length,
          sectionType
        };
      }
      return NextResponse.json(response);
    }

    // Ensure all fields are included in the response - preserve empty arrays
    const itemsWithFields = validItems.map((item: any) => {
      const result: any = {
        _id: item._id,
        product: item.product,
        sectionType: item.sectionType,
        order: item.order,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      // Add optional fields
      if (item.badge !== undefined) result.badge = item.badge;
      
      // For SPOTLIGHT items, always include these fields
      if (item.sectionType === 'SPOTLIGHT') {
        result.description = item.description !== undefined && item.description !== null ? item.description : undefined;
        result.features = Array.isArray(item.features) ? item.features : [];
        result.hotspots = Array.isArray(item.hotspots) ? item.hotspots : [];
        result.buttonText = item.buttonText !== undefined && item.buttonText !== null ? item.buttonText : undefined;
      } else {
        // For other section types, only include if they exist
        if (item.description !== undefined) result.description = item.description;
        if (item.features !== undefined) result.features = Array.isArray(item.features) ? item.features : [];
        if (item.hotspots !== undefined) result.hotspots = Array.isArray(item.hotspots) ? item.hotspots : [];
        if (item.buttonText !== undefined) result.buttonText = item.buttonText;
      }

      return result;
    });

    console.log(`[SectionProducts API] Returning ${itemsWithFields.length} items for sectionType: ${sectionType}`);
    return NextResponse.json(itemsWithFields);
  } catch (error: any) {
    console.error("[SectionProducts API] Failed to fetch section products:", error);
    console.error("[SectionProducts API] Error details:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });
    
    // Return empty array with diagnostic info
    const response: any = [];
    if (process.env.NODE_ENV === 'development') {
      (response as any).__debug = {
        error: "Failed to fetch section products",
        name: error?.name,
        message: error?.message
      };
    }
    
    // Return appropriate error based on error type
    if (error?.name === 'MongoNetworkError' || error?.message?.includes('connection')) {
      return NextResponse.json(response, { status: 503 });
    }
    
    return NextResponse.json(response, { status: 200 });
  }
}


