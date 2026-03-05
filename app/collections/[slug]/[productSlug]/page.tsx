import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import CollectionProductDetail from './CollectionProductDetail';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Product Details',
  description: 'View detailed product information, specifications, reviews, and FAQs.',
  openGraph: {
    title: 'Product Details - JioCoder',
    description: 'View detailed product information, specifications, and reviews.',
    url: '/collections',
  },
};

export default async function CollectionProductPage({ params }: { params: Promise<{ slug: string; productSlug: string }> }) {
  const { slug, productSlug } = await params;
  
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto w-full min-w-0 px-3 sm:px-4 md:px-6 py-5 sm:py-6 md:py-8 overflow-x-hidden">
        <CollectionProductDetail productId={productSlug} collectionSlug={slug} />
      </main>
      <Footer />
    </>
  );
}

