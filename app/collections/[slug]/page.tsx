'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import ProductGrid, { Product } from '@/components/ProductGrid';
import ProductSort, { SortOption } from '@/components/ProductSort';

export default function CollectionPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [collection, setCollection] = useState<{
    id: string;
    name: string;
    description: string;
    slug: string;
    productIds: string[];
  } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch collection and products
    // In a real app, this would be an API call
    const fetchCollection = async () => {
      setLoading(true);
      
      // Mock collections data (should match admin panel)
      const collections = [
        {
          id: 'col-1',
          name: 'Mechanical Keyboards',
          description: 'Premium mechanical keyboards collection',
          slug: 'mechanical-keyboards',
          productIds: ['keyboard-1', 'keyboard-2'],
        },
        {
          id: 'col-2',
          name: 'Gaming Mice',
          description: 'High-performance gaming mice',
          slug: 'gaming-mice',
          productIds: [],
        },
      ];

      const foundCollection = collections.find((col) => col.slug === slug);
      
      if (foundCollection) {
        setCollection(foundCollection);
        
        // Mock products data (should match admin products)
        const allProducts: Product[] = [
          {
            id: 'keyboard-1',
            name: 'Keychron K2 Wireless Mechanical Keyboard Version 2 (Brown Switches)',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYYaK_kJQeDLBQe_vIhIfpvQFrKWDFMzT5uCj-WYv4_Yrg8fBz0tLw3B9Di8OGJpUq6MS2iK7p15s5cKdz59YvQTQOjXTWOvBvyGTlzbKzJDwOAxraZuylCZ8xUVYoya5pU74k7JRqXqhvZ6r5ByCp17LNHrQHqlKOWtSEVRu-oZViU2TpmAJIJCSgq7dgdOEZzSbDpZZgpzybypXPIFAnmRFPQ9V99esFHJeUFY0OObx28cOWcU-chPhuaZDKDNKacxKTB2qZ9-Yb',
            price: 7499,
            originalPrice: 9999,
            rating: 4.5,
            reviewCount: 2400,
            badge: { text: '-25%', color: 'red' },
            discount: 25,
            brand: 'Keychron',
            inStock: true,
          },
          {
            id: 'keyboard-2',
            name: 'Logitech MX Keys S Wireless Illuminated Keyboard',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKsZQW7Nj6vNUklr5dWHdz5iJfptn4bvN3VhJPHWL1GnAZdGLW2rMKcvVd_zFLEQRH4GecddjmBOdn-uxam63prKZmXViUF8xIrjO4F_U7oF3v0iO4iNjAGitEpAob0PBeXyLAfe-OgJPEqkmZozUCVI_mW3rRUM_GAo2nF3n2KG5cwLvmyw7i8SDeuy40etjJKeTlen72g1t_UPzgke_zzEko3eJzGjgjKQIPGdpUMvGPJkt2KqveOeWJdOwrNtjDhnxlN52BXpUh',
            price: 12995,
            rating: 5,
            reviewCount: 5800,
            badge: { text: 'Premium', color: 'primary' },
            brand: 'Logitech',
            inStock: true,
          },
        ];

        // Filter products that belong to this collection
        const collectionProducts = allProducts.filter((product) =>
          foundCollection.productIds.includes(product.id)
        );
        
        setProducts(collectionProducts);
      }
      
      setLoading(false);
    };

    fetchCollection();
  }, [slug]);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return b.reviewCount - a.reviewCount; // Using reviewCount as proxy for newness
      case 'discount':
        return (b.discount || 0) - (a.discount || 0);
      case 'popularity':
      default:
        return b.reviewCount - a.reviewCount;
    }
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="max-w-[1440px] mx-auto w-full min-w-0 px-3 sm:px-4 md:px-10 lg:px-20 py-4 sm:py-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading collection...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!collection) {
    return (
      <>
        <Navbar />
        <main className="max-w-[1440px] mx-auto w-full min-w-0 px-3 sm:px-4 md:px-10 lg:px-20 py-4 sm:py-6">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
              collections
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Collection Not Found</h1>
            <p className="text-gray-600 mb-6">The collection you're looking for doesn't exist.</p>
            <Link
              href="/products"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-[1440px] mx-auto w-full min-w-0 px-3 sm:px-4 md:px-10 lg:px-20 py-4 sm:py-6 space-y-6">
        <Breadcrumb
          autoGenerate={true}
          collectionName={collection.name}
        />

        {/* Collection Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="text-lg text-gray-600">{collection.description}</p>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{products.length} {products.length === 1 ? 'product' : 'products'}</span>
          </div>
        </div>

        {/* Sort and Filter Bar */}
        {products.length > 0 && (
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <ProductSort sortBy={sortBy} onSortChange={setSortBy} />
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <ProductGrid products={sortedProducts} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
              inventory_2
            </span>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No products in this collection</h3>
            <p className="text-gray-500 mb-6">
              This collection doesn't have any products yet. Check back later!
            </p>
            <Link
              href="/products"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

