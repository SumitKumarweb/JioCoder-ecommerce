import type { Metadata } from 'next';
import { use } from 'react';
import Navbar from '@/components/Navbar';
import ProductDetail from '@/components/ProductDetail';
import Footer from '@/components/Footer';
import { ProductSchema } from '@/components/schemas';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import mongoose from 'mongoose';

async function getProduct(id: string) {
  try {
    await connectDB();
    
    let product: any = null;
    if (mongoose.isValidObjectId(id)) {
      product = await Product.findOne({ $or: [{ slug: id }, { _id: id }] }).lean();
    } else {
      product = await Product.findOne({ slug: id }).lean();
    }
    
    return product;
  } catch (error) {
    console.error('Failed to fetch product for schema:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (product) {
    return {
      title: `${product.name} - JioCoder`,
      description: product.description || `${product.name} - Premium ${product.category || 'product'} from JioCoder. Fast India-wide shipping.`,
      openGraph: {
        title: `${product.name} - JioCoder`,
        description: product.description || `${product.name} - Premium ${product.category || 'product'}`,
        url: `/product/${product.slug || id}`,
        images: product.image ? [{ url: product.image }] : undefined,
      },
    };
  }
  
  return {
    title: 'Product Details',
    description: 'View detailed product information, specifications, reviews, and FAQs for premium mechanical keyboards and gaming peripherals.',
    openGraph: {
      title: 'Product Details - JioCoder',
      description: 'View detailed product information, specifications, and reviews.',
      url: '/product',
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  
  return (
    <>
      {product && (
        <ProductSchema
          product={{
            id: product._id.toString(),
            name: product.name,
            description: product.description,
            image: product.image,
            price: product.price,
            currency: product.currency || 'INR',
            inStock: product.inStock,
            category: product.category,
            rating: 4.8, // Default rating, can be updated when review system is implemented
            reviewCount: 1240, // Default review count
          }}
          url={`/product/${product.slug || id}`}
        />
      )}
      <Navbar />
      <main className="max-w-7xl mx-auto w-full min-w-0 px-3 sm:px-4 md:px-6 py-5 sm:py-6 md:py-8 overflow-x-hidden">
        <ProductDetail productId={id} />
      </main>
      <Footer />
    </>
  );
}

