import type { Metadata } from 'next';
import { WebPageSchema } from '@/components/schemas';

export const metadata: Metadata = {
  title: 'Curated Collections',
  description:
    'Explore JioCoder\'s curated collections of mechanical keyboards, gaming setups, keycap sets, and custom builds. Handpicked gear for every type of enthusiast.',
  keywords: [
    'keyboard collections',
    'gaming setup collections',
    'keycap collections India',
    'curated mechanical keyboards',
    'gaming peripheral bundles',
  ],
  alternates: {
    canonical: '/collections',
  },
  openGraph: {
    title: 'Curated Collections - JioCoder',
    description:
      'Explore curated collections of mechanical keyboards, gaming setups, and peripherals.',
    url: '/collections',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Curated Collections - JioCoder',
    description:
      'Explore curated collections of mechanical keyboards and gaming peripherals.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
