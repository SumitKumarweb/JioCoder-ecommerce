import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import FeaturedCategory, { FeaturedCategoryConfig } from "@/models/FeaturedCategory";
import Collection from "@/models/Collection";

// GET: Fetch all featured categories with collection details
export async function GET() {
  try {
    await connectDB();

    const featuredCategories = await FeaturedCategory.find({})
      .sort({ order: 1 })
      .lean();

    // Fetch collection details for each featured category
    const categoriesWithDetails = await Promise.all(
      featuredCategories.map(async (fc) => {
        const collection = await Collection.findById(fc.collectionId).lean();
        if (!collection) return null;

        return {
          _id: fc._id,
          name: collection.name,
          image: collection.heroImage || '',
          url: `/collections/${collection.slug}`,
        };
      })
    );

    // Get viewAllUrl from config
    const config = await FeaturedCategoryConfig.findOne().lean();
    const viewAllUrl = config?.viewAllUrl || '/products';

    // Filter out null values (collections that don't exist)
    return NextResponse.json({
      categories: categoriesWithDetails.filter(Boolean),
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
