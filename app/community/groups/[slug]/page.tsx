import type { Metadata } from 'next';
import CommunityGroupClient from './CommunityGroupClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Group · ${decodeURIComponent(slug)}`,
    alternates: { canonical: `/community/groups/${slug}` },
    robots: { index: false, follow: true },
  };
}

export default async function CommunityGroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CommunityGroupClient slug={decodeURIComponent(slug)} />;
}
