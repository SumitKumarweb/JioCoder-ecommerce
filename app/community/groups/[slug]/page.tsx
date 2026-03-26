import type { Metadata } from 'next';
import CommunityGroupClient from './CommunityGroupClient';
import { WebPageSchema } from '@/components/schemas';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Group · ${decodeURIComponent(slug)}`,
    alternates: { canonical: `/community/groups/${slug}` },
    // Public group URLs are listed in sitemap — allow indexing (aligns with sitemap.xml)
    robots: { index: true, follow: true },
  };
}

export default async function CommunityGroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  return (
    <>
      <h1 className="sr-only">{decoded} community group</h1>
      <WebPageSchema
        path={`/community/groups/${slug}`}
        type="ProfilePage"
        name={`${decoded} · Group`}
        description="JioCoder community group chat and members."
      />
      <CommunityGroupClient slug={decoded} />
    </>
  );
}
