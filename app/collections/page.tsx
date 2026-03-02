'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';

interface Collection {
  id: string;
  name: string;
  description: string;
  slug: string;
  productIds: string[];
  featuredImage?: string;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch collections
    // In a real app, this would be an API call
    const fetchCollections = async () => {
      setLoading(true);
      
      // Mock collections data (should match admin panel)
      const mockCollections: Collection[] = [
        {
          id: 'col-1',
          name: 'Mechanical Keyboards',
          description: 'Premium mechanical keyboards collection',
          slug: 'mechanical-keyboards',
          productIds: ['keyboard-1', 'keyboard-2'],
          featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYYaK_kJQeDLBQe_vIhIfpvQFrKWDFMzT5uCj-WYv4_Yrg8fBz0tLw3B9Di8OGJpUq6MS2iK7p15s5cKdz59YvQTQOjXTWOvBvyGTlzbKzJDwOAxraZuylCZ8xUVYoya5pU74k7JRqXqhvZ6r5ByCp17LNHrQHqlKOWtSEVRu-oZViU2TpmAJIJCSgq7dgdOEZzSbDpZZgpzybypXPIFAnmRFPQ9V99esFHJeUFY0OObx28cOWcU-chPhuaZDKDNKacxKTB2qZ9-Yb',
        },
        {
          id: 'col-2',
          name: 'Gaming Mice',
          description: 'High-performance gaming mice',
          slug: 'gaming-mice',
          productIds: [],
        },
      ];

      setCollections(mockCollections);
      setLoading(false);
    };

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="max-w-[1440px] mx-auto w-full min-w-0 px-3 sm:px-4 md:px-10 lg:px-20 py-4 sm:py-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading collections...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-[1440px] mx-auto w-full min-w-0 px-3 sm:px-4 md:px-10 lg:px-20 py-4 sm:py-6 space-y-8">
        <Breadcrumb
          autoGenerate={true}
        />

        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Product Collections</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our curated collections of premium products, handpicked for quality and performance.
          </p>
        </div>

        {/* Collections Grid */}
        {collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  {collection.featuredImage ? (
                    <img
                      src={collection.featuredImage}
                      alt={collection.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-6xl text-gray-300">
                        collections
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900 inline-block">
                      {collection.productIds.length} {collection.productIds.length === 1 ? 'product' : 'products'}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {collection.name}
                  </h2>
                  {collection.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">{collection.description}</p>
                  )}
                  <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                    <span>View Collection</span>
                    <span className="material-symbols-outlined text-base ml-2 group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
              collections
            </span>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Collections Available</h3>
            <p className="text-gray-500 mb-6">
              Collections will appear here once they are created.
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

