import type { Metadata } from "next";

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const slug = params?.slug ? encodeURIComponent(params.slug) : "";

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

