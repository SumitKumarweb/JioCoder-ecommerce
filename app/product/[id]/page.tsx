import type { Metadata } from 'next';
import { use } from 'react';
import Navbar from '@/components/Navbar';
import ProductDetail from '@/components/ProductDetail';
import Footer from '@/components/Footer';
import { ProductSchema, WebPageSchema } from '@/components/schemas';
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
    const canonicalSlug = product.slug || id;
    const desc =
      product.description ||
      `Buy ${product.name} — premium ${product.category || 'gaming peripheral'} from JioCoder. Authentic gear with fast India-wide shipping and expert support.`;

    return {
      title: `${product.name} - JioCoder`,
      description: desc,
      keywords: [
        product.name,
        product.category,
        'buy online India',
        'JioCoder',
        'fast shipping India',
      ].filter(Boolean) as string[],
      alternates: {
        canonical: `/product/${canonicalSlug}`,
      },
      openGraph: {
        title: `${product.name} - JioCoder`,
        description: desc,
        url: `/product/${canonicalSlug}`,
        type: 'website',
        images: product.image ? [{ url: product.image, alt: product.name }] : undefined,
      },
      twitter: {
        card: product.image ? 'summary_large_image' : 'summary',
        title: `${product.name} - JioCoder`,
        description: desc,
        images: product.image ? [product.image] : undefined,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }

  return {
    title: 'Product Details',
    description:
      'View detailed product information, specifications, reviews, and FAQs for premium mechanical keyboards and gaming peripherals.',
    openGraph: {
      title: 'Product Details - JioCoder',
      description:
        'View detailed product information, specifications, and reviews.',
      url: '/product',
    },
    robots: { index: false, follow: true },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  
  const canonicalPath = `/product/${product ? product.slug || id : id}`;

  return (
    <>
      {product && (
        <WebPageSchema
          path={canonicalPath}
          type="ItemPage"
          name={`${product.name} - JioCoder`}
          description={
            product.description ||
            `Buy ${product.name} — premium ${product.category || 'gaming peripheral'} from JioCoder.`
          }
        />
      )}
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
            // aggregateRating omitted until reviews are stored on the product model
          }}
          url={`/product/${product.slug || id}`}
        />
      )}
      <Navbar />
      <main className="max-w-7xl mx-auto w-full min-w-0 px-3 sm:px-4 md:px-6 py-5 sm:py-6 md:py-8 overflow-x-hidden">
        <h1 className="sr-only">{product ? product.name : "Product details"}</h1>
        <ProductDetail productId={id} />
      </main>
      <Footer />
    </>
  );
}

