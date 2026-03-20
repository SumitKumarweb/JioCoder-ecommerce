import type { Metadata } from 'next';
import { WebPageSchema } from '@/components/schemas';

// Search result pages should not be indexed — they are session-specific,
// produce near-infinite URL variations (?q=...), and waste crawl budget.
export const metadata: Metadata = {
  title: 'Search',
  description:
    'Search for mechanical keyboards, gaming mice, keycaps, custom cables, blog articles, and collections on JioCoder.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WebPageSchema
        path="/search"
        name="Search - JioCoder"
        description="Search products, blog posts, and collections on JioCoder."
      />
      {children}
    </>
  );
}
