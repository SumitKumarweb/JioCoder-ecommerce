import { Metadata } from 'next';
import connectDB from '@/lib/db';
import PageMetadata from '@/models/PageMetadata';

export async function generateMetadata(): Promise<Metadata> {
  try {
    await connectDB();
    const meta = await PageMetadata.findOne({ path: '/studio' }).lean() as any;
    if (meta) {
      return {
        title: meta.metaTitle || 'JioCoder Design Studio — Custom Mouse Pad Printing',
        description: meta.metaDescription || 'Design and print your own custom mouse pads with the JioCoder Studio. Upload artwork, add text, pick sizes, and order in minutes.',
        keywords: meta.metaKeywords || 'custom mouse pad, print on demand, gaming mousepad, desk mat, custom print',
        openGraph: {
          title: meta.ogTitle || meta.metaTitle || 'JioCoder Design Studio',
          description: meta.ogDescription || meta.metaDescription || '',
          images: meta.ogImage ? [meta.ogImage] : [],
        },
        alternates: { canonical: meta.canonicalUrl || 'https://www.jiocoder.com/studio' },
        robots: meta.noIndex ? 'noindex, nofollow' : 'index, follow',
      };
    }
  } catch { /* fallback below */ }

  return {
    title: 'JioCoder Design Studio — Custom Mouse Pad Printing',
    description: 'Design and print your own custom mouse pads with the JioCoder Studio. Upload artwork, add text, pick sizes, and order in minutes.',
    alternates: { canonical: 'https://www.jiocoder.com/studio' },
  };
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
