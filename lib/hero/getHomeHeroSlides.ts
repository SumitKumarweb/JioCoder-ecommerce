import type { HeroSlide } from "@/components/Hero";
import connectDB from "@/lib/db";
import HeroSlideModel from "@/models/HeroSlide";

/** Server-only: hero data for homepage LCP (same rules as GET /api/hero). */
export async function getHomeHeroSlides(): Promise<HeroSlide[]> {
  try {
    await connectDB();
    const rows = await HeroSlideModel.find({ enabled: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return (
      rows as {
        _id: unknown;
        image: string;
        tag?: string;
        title: string;
        subtitle?: string;
        buttonText?: string;
        url?: string;
        enabled?: boolean;
      }[]
    ).map((s) => ({
      id: String(s._id),
      image: s.image,
      tag: s.tag,
      title: s.title,
      subtitle: s.subtitle,
      buttonText: s.buttonText,
      url: s.url,
      enabled: s.enabled !== false,
    }));
  } catch (e) {
    console.error("getHomeHeroSlides:", e);
    return [];
  }
}
