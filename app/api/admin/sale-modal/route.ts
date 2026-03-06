import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SaleModalConfig from "@/models/SaleModalConfig";

// NOTE: Add proper admin authentication/authorization here before using in production.

const DEFAULT_CONFIG = {
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

async function getOrCreateConfig() {
  const existing = await SaleModalConfig.findOne({}).lean();
  if (existing) return existing;
  const created = await SaleModalConfig.create(DEFAULT_CONFIG);
  return created.toObject();
}

export async function GET() {
  try {
    await connectDB();
    const config = await getOrCreateConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error("Admin GET /sale-modal failed:", error);
    return NextResponse.json({ message: "Failed to fetch sale modal config" }, { status: 500 });
  }
}

// Upsert (create/update) the single config document
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const update = {
      enabled: body.enabled ?? DEFAULT_CONFIG.enabled,
      showEveryNthVisit: Number(body.showEveryNthVisit ?? DEFAULT_CONFIG.showEveryNthVisit) || DEFAULT_CONFIG.showEveryNthVisit,
      leftImageUrl: body.leftImageUrl ?? DEFAULT_CONFIG.leftImageUrl,
      leftImageAlt: body.leftImageAlt ?? DEFAULT_CONFIG.leftImageAlt,
      leftBadgeText: body.leftBadgeText ?? DEFAULT_CONFIG.leftBadgeText,
      leftHeading: body.leftHeading ?? DEFAULT_CONFIG.leftHeading,
      titlePrefix: body.titlePrefix ?? DEFAULT_CONFIG.titlePrefix,
      titleHighlight: body.titleHighlight ?? DEFAULT_CONFIG.titleHighlight,
      titleSuffix: body.titleSuffix ?? DEFAULT_CONFIG.titleSuffix,
      description: body.description ?? DEFAULT_CONFIG.description,
      emailLabel: body.emailLabel ?? DEFAULT_CONFIG.emailLabel,
      emailPlaceholder: body.emailPlaceholder ?? DEFAULT_CONFIG.emailPlaceholder,
      submitButtonText: body.submitButtonText ?? DEFAULT_CONFIG.submitButtonText,
      dismissText: body.dismissText ?? DEFAULT_CONFIG.dismissText,
      bottomIcons: Array.isArray(body.bottomIcons) ? body.bottomIcons : DEFAULT_CONFIG.bottomIcons,
    };

    // ensure only one doc exists
    const updated = await SaleModalConfig.findOneAndUpdate({}, update, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }).lean();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Admin PUT /sale-modal failed:", error);
    return NextResponse.json({ message: "Failed to save sale modal config" }, { status: 500 });
  }
}


