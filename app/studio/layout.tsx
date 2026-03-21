import type { Metadata } from 'next';
import { WebPageSchema, BreadcrumbSchema } from '@/components/schemas';

export const metadata: Metadata = {
  title: 'JioCoder Studio — Custom desk mats & mouse pads',
  description:
    'Design your own desk mat or extended mouse pad in the browser: upload artwork, pick size and colors, add text, and order print-to-order shipping across India. Ideal for gaming setups and creators.',
  keywords: [
    'custom desk mat India',
    'custom mouse pad',
    'print desk mat',
    'XL mouse pad custom',
    'gaming desk mat',
    'JioCoder Studio',
    'personalized mousepad',
  ],
  alternates: {
    canonical: '/studio',
  },
  openGraph: {
    title: 'JioCoder Studio — Custom desk mats & mouse pads',
    description:
      'Upload your design, choose size and materials, and order a custom-printed desk mat shipped in India.',
    url: '/studio',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'JioCoder Studio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JioCoder Studio — Custom desk mats',
    description: 'Design and order custom desk mats and large mouse pads with India-wide shipping.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageSchema
        path="/studio"
        type="WebPage"
        name="JioCoder Studio — Custom desk mats & mouse pads"
        description="Browser-based designer for custom-printed desk mats and extended mouse pads. Upload graphics, choose dimensions, materials, and text; order with shipping across India."
      />
      <BreadcrumbSchema
        items={[
          { label: 'Home', href: '/' },
          { label: 'Studio' },
        ]}
      />
      {children}
    </>
  );
}
