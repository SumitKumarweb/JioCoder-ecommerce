import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SaleModalConfig from "@/models/SaleModalConfig";

const FALLBACK_CONFIG = {
  enabled: true,
  showEveryNthVisit: 6,
  leftImageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAjDoyekeODajybVX9n2INQcvMNl7ULZ2BxnXpixKg_epck_GX3EysJ3DsVYofMcg0EMNJjTaeKzizjRGWseCoLfQh6DKMjBdXs6uPOsVqXK-5us8lGMM2d1sJig4lAgcWZrNyNIBHLug4AkHEKYEr2FOLzvlCQEIGeyLmdoFRQh6Fo8awef4_0Dfo_FOVugCq-tdiqiDetE6-ySGntl",
  leftImageAlt: "Premium RGB Gaming Mouse Pad",
  leftBadgeText: "Limited Time Offer",
  leftHeading: "Enhance Your Setup",
  titlePrefix: "GET",
  titleHighlight: "20% OFF",
  titleSuffix: "YOUR FIRST ORDER!",
  description:
    "Join the JioCoder community. Sign up for our newsletter to unlock your exclusive discount code and stay updated on the latest tech drops.",
  emailLabel: "Email Address",
  emailPlaceholder: "e.g. arjun@example.com",
  submitButtonText: "Claim My Discount",
  dismissText: "No thanks, I'll pay full price",
  bottomIcons: ["verified_user", "local_shipping", "payments"],
};

export async function GET() {
  try {
    await connectDB();
    const config = await SaleModalConfig.findOne({}).lean();
    if (!config) {
      return NextResponse.json(FALLBACK_CONFIG);
    }
    return NextResponse.json(config);
  } catch (error) {
    console.error("GET /sale-modal failed:", error);
    // Public endpoint should never hard-fail rendering; return fallback.
    return NextResponse.json(FALLBACK_CONFIG);
  }
}


