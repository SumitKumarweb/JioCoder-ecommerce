import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import FeaturedCategory, { FeaturedCategoryConfig } from "@/models/FeaturedCategory";
import Collection from "@/models/Collection";

// GET: Fetch all featured categories
export async function GET() {
  try {
    await connectDB();
    const categories = await FeaturedCategory.find({}).sort({ order: 1 }).lean();
    
    // Get viewAllUrl from config
    const config = await FeaturedCategoryConfig.findOne().lean();
    const viewAllUrl = config?.viewAllUrl || '/products';
    
    return NextResponse.json({
      categories,
      viewAllUrl,
    });
  } catch (error) {
    console.error("Failed to fetch featured categories:", error);
    return NextResponse.json(
      { message: "Failed to fetch featured categories" },
      { status: 500 }
    );
  }
}

// POST: Create or update featured categories
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { collectionIds, viewAllUrl } = body;

    if (!Array.isArray(collectionIds)) {
      return NextResponse.json(
        { message: "collectionIds must be an array" },
        { status: 400 }
      );
    }

    // Delete all existing featured categories
    await FeaturedCategory.deleteMany({});

    // If no collections selected, just save the viewAllUrl and return empty array
    if (collectionIds.length === 0) {
      await FeaturedCategoryConfig.findOneAndUpdate(
        {},
        { viewAllUrl: viewAllUrl || '/products' },
        { upsert: true, new: true }
      );

      return NextResponse.json({
        message: "Featured categories saved successfully",
        categories: [],
        viewAllUrl: viewAllUrl || '/products',
      });
    }

    // Validate that all collectionIds exist in the database
    const validCollections = await Collection.find({
      _id: { $in: collectionIds },
    }).select('_id').lean();

    const validCollectionIds = validCollections.map((col) => String(col._id));
    const invalidIds = collectionIds.filter((id: string) => !validCollectionIds.includes(String(id)));

    if (invalidIds.length > 0) {
      console.warn('Some collection IDs are invalid:', invalidIds);
      // Continue with valid IDs only
    }

    if (validCollectionIds.length === 0) {
      return NextResponse.json(
        { message: "No valid collections found" },
        { status: 400 }
      );
    }

    // Insert new featured categories with order (only valid collections)
    const categoriesToInsert = validCollectionIds.map((collectionId: string, index: number) => ({
      collectionId: String(collectionId), // Ensure it's a string
      order: index,
    }));

    const created = await FeaturedCategory.insertMany(categoriesToInsert, {
      ordered: false, // Continue inserting even if one fails
    });

    // Save viewAllUrl to config
    await FeaturedCategoryConfig.findOneAndUpdate(
      {},
      { viewAllUrl: viewAllUrl || '/products' },
      { upsert: true, new: true, strict: false }
    );

    return NextResponse.json({
      message: "Featured categories saved successfully",
      categories: created,
      viewAllUrl: viewAllUrl || '/products',
    });
  } catch (error: any) {
    console.error("Failed to save featured categories:", error);
    return NextResponse.json(
      { 
        message: "Failed to save featured categories",
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
