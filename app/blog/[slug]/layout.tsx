import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = rawSlug ? encodeURIComponent(rawSlug) : "";

  return {
    title: "Blog Article - JioCoder",
    description:
      "Read in-depth articles about mechanical keyboards, developer tools, and tech setups on JioCoder blog.",
    alternates: {
      canonical: slug ? `/blog/${slug}` : "/blog",
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

