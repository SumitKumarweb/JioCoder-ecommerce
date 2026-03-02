import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - JioCoder',
  description:
    'Read the latest tech guides, product reviews, setup tours, and industry news. From mechanical keyboards to gaming PCs, stay informed with JioCoder blog.',
  keywords: ['tech blog', 'gaming guides', 'electronics reviews', 'setup tours', 'tech news'],
  openGraph: {
    title: 'Blog - JioCoder',
    description: 'Read the latest tech guides, product reviews, setup tours, and industry news.',
    type: 'website',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

