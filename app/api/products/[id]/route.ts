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

export async function GET(_req: NextRequest, context: PublicProductRouteContext) {
  try {
    const { id } = await context.params;
    await connectDB();

    // Look up by slug first; fall back to MongoDB ObjectId for backwards compatibility
    let product: any = mongoose.isValidObjectId(id)
      ? await Product.findOne({ $or: [{ slug: id }, { _id: id }] }).lean()
      : await Product.findOne({ slug: id }).lean();

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Auto-generate and save slug for old products that don't have one yet
    if (!product.slug) {
      const baseSlug = generateSlug(product.name);
      // Ensure uniqueness by checking for existing slugs with same base
      const existingCount = await Product.countDocuments({
        slug: new RegExp(`^${baseSlug}(-\\d+)?$`),
        _id: { $ne: product._id },
      });
      const slug = existingCount > 0 ? `${baseSlug}-${existingCount + 1}` : baseSlug;

      // Save slug to DB so future lookups work by slug
      await Product.findByIdAndUpdate(product._id, { $set: { slug } });
      product = { ...product, slug };
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}


