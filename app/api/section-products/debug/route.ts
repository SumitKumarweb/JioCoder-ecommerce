import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SectionProduct from "@/models/SectionProduct";
import Product from "@/models/Product";

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasMongoUri: !!process.env.MONGODB_URI,
    mongoUriLength: process.env.MONGODB_URI?.length || 0,
  };

  try {
    // Test database connection
    try {
      await connectDB();
      diagnostics.dbConnection = "success";
    } catch (dbError: any) {
      diagnostics.dbConnection = "failed";
      diagnostics.dbError = dbError?.message || String(dbError);
      return NextResponse.json(diagnostics, { status: 200 });
    }

    // Count documents
    diagnostics.sectionProductCount = await SectionProduct.countDocuments({});
    diagnostics.productCount = await Product.countDocuments({});

    // Count by section type
    diagnostics.trendingCount = await SectionProduct.countDocuments({ sectionType: "TRENDING" });
    diagnostics.bestSellerCount = await SectionProduct.countDocuments({ sectionType: "BEST_SELLER" });
    diagnostics.spotlightCount = await SectionProduct.countDocuments({ sectionType: "SPOTLIGHT" });

    // Sample a few SectionProduct documents
    const sampleItems = await SectionProduct.find({})
      .limit(3)
      .select("_id sectionType order product")
      .lean();

    diagnostics.sampleItems = sampleItems.map((item: any) => ({
      _id: item._id,
      sectionType: item.sectionType,
      order: item.order,
      hasProduct: !!item.product,
      productId: item.product?.toString() || null,
    }));

    // Test populate
    if (sampleItems.length > 0) {
      const testItem = await SectionProduct.findById(sampleItems[0]._id)
        .populate("product")
        .lean();
      
      diagnostics.populateTest = {
        success: !!testItem?.product,
        productExists: !!(testItem as any)?.product?._id,
      };
    }

    diagnostics.status = "ok";
  } catch (error: any) {
    diagnostics.status = "error";
    diagnostics.error = error?.message || String(error);
    diagnostics.errorStack = error?.stack;
  }

  return NextResponse.json(diagnostics, { status: 200 });
}

