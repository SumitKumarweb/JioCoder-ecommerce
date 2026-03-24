import type { Metadata } from "next";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { absoluteMediaUrl } from "@/lib/seo/absoluteMediaUrl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  let canonicalSlug = "";
  try {
    canonicalSlug = decodeURIComponent(rawSlug || "").trim().toLowerCase();
  } catch {
    canonicalSlug = (rawSlug || "").trim().toLowerCase();
  }

  // Use DB data for metadata. Fall back to title if other fields are missing.
  let title = "Blog Article - JioCoder";
  let description =
    "Read in-depth articles about mechanical keyboards, developer tools, and tech setups on JioCoder blog.";
  let keywords: string[] = ["tech blog", "JioCoder", "mechanical keyboards", "developer tools"];
  let featuredImage: string | null = null;
  let category: string | null = null;
  let tags: string[] = [];
  let authorName: string | null = null;
  let publishedTime: string | undefined;
  let modifiedTime: string | undefined;

  try {
    // slug in DB is stored lowercase (see Blog schema).
    await connectDB();
    const blog = await Blog.findOne({ slug: canonicalSlug, published: true }).lean();

    if (blog) {
      title = blog.title || title;
      description = blog.description || blog.summary || blog.title || description;
      category = blog.category || null;
      tags = Array.isArray(blog.tags) ? blog.tags : [];
      featuredImage = blog.featuredImage || null;
      const a = blog.author as { name?: string } | undefined;
      authorName = a?.name?.trim() || null;

      const b = blog as {
        publishedAt?: Date;
        updatedAt?: Date;
      };
      if (b.publishedAt) {
        publishedTime = new Date(b.publishedAt).toISOString();
      }
      if (b.updatedAt) {
        modifiedTime = new Date(b.updatedAt).toISOString();
      }

      keywords = [
        ...(category ? [category] : []),
        ...(tags || []),
        "tech blog",
        "mechanical keyboards",
        "gaming peripherals",
        "JioCoder",
      ].filter(Boolean) as string[];
    }
  } catch (e) {
    // Don't fail metadata generation if DB is temporarily unavailable.
  }

  const ogImageAbs = absoluteMediaUrl(featuredImage);
  const ogImages = ogImageAbs
    ? [{ url: ogImageAbs, alt: title }]
    : undefined;

  return {
    title,
    description,
    keywords,
    ...(authorName ? { authors: [{ name: authorName }] } : {}),
    alternates: {
      canonical: canonicalSlug ? `/blog/${canonicalSlug}` : "/blog",
    },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "en_IN",
      url: canonicalSlug ? `/blog/${canonicalSlug}` : "/blog",
      images: ogImages,
      publishedTime,
      modifiedTime,
      ...(authorName ? { authors: [authorName] } : {}),
      ...(category ? { section: category } : {}),
      ...(tags.length ? { tags } : {}),
    },
    twitter: {
      card: ogImageAbs ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImageAbs ? [ogImageAbs] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

