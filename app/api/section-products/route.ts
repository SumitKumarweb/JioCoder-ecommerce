import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SectionProduct from "@/models/SectionProduct";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const sectionType = searchParams.get("sectionType");

    const query: Record<string, unknown> = {};
    if (sectionType) {
      query.sectionType = sectionType;
    }

    const items = await SectionProduct.find(query)
      .populate("product")
      .sort({ sectionType: 1, order: 1 })
      .lean();

    console.log('GET /api/section-products - Raw items count:', items.length);
    if (items.length > 0) {
      console.log('First item raw from DB:', JSON.stringify(items[0], null, 2));
      console.log('First item features:', items[0].features);
      console.log('First item hotspots:', items[0].hotspots);
    }

    // Ensure all fields are included in the response - preserve empty arrays
    const itemsWithFields = items.map((item: any) => {
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

    return NextResponse.json(itemsWithFields);
  } catch (error) {
    console.error("Failed to fetch section products:", error);
    return NextResponse.json(
      { message: "Failed to fetch section products" },
      { status: 500 }
    );
  }
}


