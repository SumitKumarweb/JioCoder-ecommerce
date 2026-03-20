import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import CollectionProductDetail from './CollectionProductDetail';
import Footer from '@/components/Footer';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import mongoose from 'mongoose';
import { ProductSchema, WebPageSchema } from '@/components/schemas';

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
    console.error('Failed to fetch product for collection PDP:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}): Promise<Metadata> {
  const { slug, productSlug } = await params;
  const product = await getProduct(productSlug);

  if (product) {
    const canonicalSlug = product.slug || productSlug;
    const desc =
      product.description ||
      `Buy ${product.name} — premium ${product.category || 'gaming peripheral'} from JioCoder.`;

    return {
      title: `${product.name} - JioCoder`,
      description: desc,
      alternates: {
        canonical: `/collections/${slug}/${canonicalSlug}`,
      },
      openGraph: {
        title: `${product.name} - JioCoder`,
        description: desc,
        url: `/collections/${slug}/${canonicalSlug}`,
        type: 'website',
        images: product.image ? [{ url: product.image, alt: product.name }] : undefined,
      },
      robots: { index: true, follow: true },
    };
  }

  return {
    title: 'Product Details',
    description: 'View detailed product information, specifications, reviews, and FAQs.',
    openGraph: {
      title: 'Product Details - JioCoder',
      description: 'View detailed product information, specifications, and reviews.',
      url: '/collections',
    },
    robots: { index: false, follow: true },
  };
}

export default async function CollectionProductPage({
  params,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}) {
  const { slug, productSlug } = await params;
  const product = await getProduct(productSlug);
  const canonicalPath = `/collections/${slug}/${product ? product.slug || productSlug : productSlug}`;

  return (
    <>
      {product && (
        <>
          <WebPageSchema
            path={canonicalPath}
            type="ItemPage"
            name={`${product.name} - JioCoder`}
            description={
              product.description ||
              `Buy ${product.name} — premium ${product.category || 'gaming peripheral'} from JioCoder.`
            }
          />
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
              rating: 4.8,
              reviewCount: 1240,
            }}
            url={canonicalPath}
          />
        </>
      )}
      <Navbar />
      <main className="max-w-7xl mx-auto w-full min-w-0 px-3 sm:px-4 md:px-6 py-5 sm:py-6 md:py-8 overflow-x-hidden">
        <CollectionProductDetail productId={productSlug} collectionSlug={slug} />
      </main>
      <Footer />
    </>
  );
}
