import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mechanical Keyboards & Gaming Peripherals',
  description:
    'Browse our complete range of premium mechanical keyboards, gaming mice, keycaps, custom cables, and gaming peripherals. Authentic gear with fast India-wide shipping and expert support.',
  keywords: [
    'mechanical keyboards India',
    'buy gaming keyboard online',
    'gaming mice India',
    'keycaps buy online',
    'custom cables India',
    'gaming peripherals India',
    'keyboard accessories',
  ],
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'Mechanical Keyboards & Gaming Peripherals - JioCoder',
    description:
      'Browse premium mechanical keyboards, gaming mice, keycaps and more. Fast India-wide shipping.',
    url: '/products',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mechanical Keyboards & Gaming Peripherals - JioCoder',
    description:
      'Browse premium mechanical keyboards, gaming mice, keycaps and more.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
