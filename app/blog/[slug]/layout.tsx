import type { Metadata } from "next";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = rawSlug ? encodeURIComponent(rawSlug) : "";

  // Use DB data for metadata. Fall back to title if other fields are missing.
  let title = "Blog Article - JioCoder";
  let description =
    "Read in-depth articles about mechanical keyboards, developer tools, and tech setups on JioCoder blog.";
  let keywords: string[] = ["tech blog", "JioCoder", "mechanical keyboards", "developer tools"];
  let featuredImage: string | null = null;
  let category: string | null = null;
  let tags: string[] = [];

  try {
    // slug in DB is stored lowercase; we still query with the decoded slug.
    await connectDB();
    const decodedSlug = rawSlug?.trim() || "";
    const blog = await Blog.findOne({ slug: decodedSlug, published: true }).lean();

    if (blog) {
      title = blog.title || title;
      description = blog.description || blog.summary || blog.title || description;
      category = blog.category || null;
      tags = Array.isArray(blog.tags) ? blog.tags : [];
      featuredImage = blog.featuredImage || null;

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

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: slug ? `/blog/${slug}` : "/blog",
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: slug ? `/blog/${slug}` : "/blog",
      images: featuredImage ? [featuredImage] : undefined,
    },
    twitter: {
      card: featuredImage ? "summary_large_image" : "summary",
      title,
      description,
      images: featuredImage ? [featuredImage] : undefined,
    },
    robots: {
      index: true,
      follow: true,
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

