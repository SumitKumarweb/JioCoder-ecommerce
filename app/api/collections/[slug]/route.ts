import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Collection from "@/models/Collection";
import Product from "@/models/Product";

type RouteContext = { params: Promise<{ slug: string }> };

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

// Public endpoint: fetch a collection by slug along with its linked products
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    await connectDB();

    // Find collection by slug
    const collection = await Collection.findOne({ slug }).lean();

    if (!collection) {
      return NextResponse.json(
        { message: "Collection not found" },
        { status: 404 }
      );
    }

    const productIds = (collection.productIds || []).map((id: any) =>
      new mongoose.Types.ObjectId(String(id))
    );

    // Fetch all products whose _id is in the collection's productIds
    let products =
      productIds.length > 0
        ? await Product.find({ _id: { $in: productIds } }).lean()
        : [];

    // Auto-generate and save slugs for products that don't have them yet
    // This ensures all product URLs use slugs, never MongoDB IDs
    for (const product of products) {
      if (!product.slug) {
        const baseSlug = generateSlug(product.name);
        const existingCount = await Product.countDocuments({
          slug: new RegExp(`^${baseSlug}(-\\d+)?$`),
          _id: { $ne: product._id },
        });
        const newSlug = existingCount > 0 ? `${baseSlug}-${existingCount + 1}` : baseSlug;

        // Save slug to DB
        await Product.findByIdAndUpdate(product._id, { $set: { slug: newSlug } });
        product.slug = newSlug;
      }
    }

    return NextResponse.json({ collection, products });
  } catch (error) {
    console.error("GET /api/collections/[slug] failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}

