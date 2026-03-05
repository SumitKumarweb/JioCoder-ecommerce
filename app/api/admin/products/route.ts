import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

/** Convert a product name into a URL-friendly slug, e.g. "Logitech MX Master 3S" → "logitech-mx-master-3s" */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // remove non-alphanumeric chars (except spaces/hyphens)
    .replace(/\s+/g, '-')           // spaces → hyphens
    .replace(/-+/g, '-')            // collapse multiple hyphens
    .replace(/^-|-$/g, '');         // trim leading/trailing hyphens
}

// NOTE: Add proper admin authentication/authorization here before using in production.

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const query: Record<string, unknown> = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Admin GET /products failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Auto-generate a unique slug from the product name
    const baseSlug = generateSlug(body.name);
    // If a product with this slug already exists, append a short suffix to keep it unique
    const existingCount = await Product.countDocuments({ slug: new RegExp(`^${baseSlug}(-\\d+)?$`) });
    const slug = existingCount > 0 ? `${baseSlug}-${existingCount + 1}` : baseSlug;

    const product = await Product.create({
      name: body.name,
      slug,
      price: body.price,
      currency: body.currency || "INR",
      inStock: body.inStock ?? true,
      description: body.description,
      image: body.image,
      category: body.category,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Admin POST /products failed:", error);
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}


