import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HeroSlide from "@/models/HeroSlide";

// NOTE: Add proper admin authentication/authorization here before using in production.

export async function GET() {
  try {
    await connectDB();
    const slides = await HeroSlide.find().sort({ order: 1 }).lean();
    return NextResponse.json(slides);
  } catch (error) {
    console.error("Admin GET /homepage-hero failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch hero slides" },
      { status: 500 }
    );
  }
}

// Create a new hero slide
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const slide = new HeroSlide({
      image: body.image || '',
      tag: body.tag,
      title: body.title || 'New Slide',
      subtitle: body.subtitle,
      buttonText: body.buttonText || 'Shop Now',
      url: body.url || '/',
      enabled: body.enabled ?? true,
      order: body.order ?? 0,
    });

    await slide.save();
    return NextResponse.json(slide.toObject());
  } catch (error) {
    console.error("Admin POST /homepage-hero failed:", error);
    return NextResponse.json(
      { message: "Failed to create hero slide" },
      { status: 500 }
    );
  }
}

// Bulk save/replace hero carousel slides
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const slides = Array.isArray(body.slides) ? body.slides : [];

    await HeroSlide.deleteMany({});

    if (slides.length > 0) {
      const docs = slides.map((slide: any, index: number) => ({
        image: slide.image,
        tag: slide.tag,
        title: slide.title,
        subtitle: slide.subtitle,
        buttonText: slide.buttonText,
        url: slide.url,
        enabled: slide.enabled ?? true,
        order: slide.order ?? index,
      }));
      await HeroSlide.insertMany(docs);
    }

    const saved = await HeroSlide.find().sort({ order: 1 }).lean();
    return NextResponse.json(saved);
  } catch (error) {
    console.error("Admin PUT /homepage-hero failed:", error);
    return NextResponse.json(
      { message: "Failed to save hero slides" },
      { status: 500 }
    );
  }
}


