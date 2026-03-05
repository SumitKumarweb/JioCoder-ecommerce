import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SectionProduct from "@/models/SectionProduct";

export async function GET(req: NextRequest) {
  try {
    // Connect to database with error handling
    try {
      await connectDB();
    } catch (dbError: any) {
      console.error("Database connection failed:", dbError?.message || dbError);
      // Return empty array instead of 500 error to prevent breaking the page
      // This allows the frontend to continue working even if DB is temporarily unavailable
      return NextResponse.json([], { status: 200 });
    }

    const { searchParams } = new URL(req.url);
    const sectionType = searchParams.get("sectionType");

    console.log(`[SectionProducts API] Fetching products for sectionType: ${sectionType}`);

    const query: Record<string, unknown> = {};
    if (sectionType) {
      query.sectionType = sectionType;
    }

    // First, check if we have any SectionProduct documents at all
    const totalCount = await SectionProduct.countDocuments(query);
    console.log(`[SectionProducts API] Total SectionProduct documents found: ${totalCount}`);

    if (totalCount === 0) {
      console.warn(`[SectionProducts API] No SectionProduct documents found for sectionType: ${sectionType}`);
      return NextResponse.json([]);
    }

    // Fetch items with populate, but handle cases where product might be null
    const items = await SectionProduct.find(query)
      .populate({
        path: "product",
        // Don't throw error if product is missing, just return null
        options: { lean: true }
      })
      .sort({ sectionType: 1, order: 1 })
      .lean();

    console.log(`[SectionProducts API] Found ${items.length} items after query`);

    // Filter out items where product is null or undefined (broken references)
    const validItems = items.filter((item: any) => {
      const isValid = item.product && item.product._id;
      if (!isValid) {
        console.warn(`[SectionProducts API] Filtered out item ${item._id} - product is null or missing`);
      }
      return isValid;
    });

    console.log(`[SectionProducts API] Valid items after filtering: ${validItems.length}`);

    // If no valid items, return empty array
    if (validItems.length === 0) {
      console.warn(`[SectionProducts API] No valid items found for sectionType: ${sectionType}`);
      return NextResponse.json([]);
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
    console.error("[SectionProducts API] Error stack:", error?.stack);
    // Return empty array instead of 500 to prevent breaking the page
    // Log the error for debugging but don't crash the frontend
    return NextResponse.json([], { status: 200 });
  }
}


