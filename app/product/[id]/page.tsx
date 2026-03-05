import type { Metadata } from 'next';
import { use } from 'react';
import Navbar from '@/components/Navbar';
import ProductDetail from '@/components/ProductDetail';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Product Details',
  description: 'View detailed product information, specifications, reviews, and FAQs for premium mechanical keyboards and gaming peripherals.',
  openGraph: {
    title: 'Product Details - JioCoder',
    description: 'View detailed product information, specifications, and reviews.',
    url: '/product',
  },
};

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto w-full min-w-0 px-3 sm:px-4 md:px-6 py-5 sm:py-6 md:py-8 overflow-x-hidden">
        <ProductDetail productId={id} />
      </main>
      <Footer />
    </>
  );
}

