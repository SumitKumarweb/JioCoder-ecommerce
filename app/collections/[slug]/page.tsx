'use client';

import { useState, useMemo, useEffect, Suspense, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import ProductFilters, { FilterState } from '@/components/ProductFilters';
import ProductGrid, { Product } from '@/components/ProductGrid';
import ProductSort, { SortOption } from '@/components/ProductSort';
import Pagination from '@/components/Pagination';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import CollectionDetailSkeleton from '@/components/CollectionDetailSkeleton';
import { getCachedData, setCachedData, getCollectionCacheKey } from '@/utils/apiCache';
import { ProductListSchema, BreadcrumbSchema } from '@/components/schemas';

const ITEMS_PER_PAGE = 12;

interface CollectionMeta {
  id: string;
  name: string;
  description: string;
  slug: string;
  heroImage?: string;
}

export default function CollectionPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <main className="max-w-[1440px] mx-auto w-full min-w-0 px-3 sm:px-4 md:px-6 py-4 sm:py-6 overflow-x-hidden">
            <CollectionDetailSkeleton />
          </main>
          <Footer />
        </>
      }
    >
      <CollectionPageContent />
    </Suspense>
  );
}

function CollectionPageContent() {
  const params = useParams();
  const slug = params.slug as string;

  const [collection, setCollection] = useState<CollectionMeta | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [500, 50000],
    brands: [],
    minRating: 0,
    inStockOnly: false,
  });
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const loadingRef = useRef<string | null>(null);

  // Fetch collection + its products from the API (with caching to prevent duplicate calls)
  useEffect(() => {
    if (!slug) return;
    
    // Skip if already loading the same slug (prevents duplicate calls)
    if (loadingRef.current === slug) return;
    
    loadingRef.current = slug;

    const fetchCollection = async () => {
      setLoading(true);
      setNotFound(false);
      
      try {
        // Check cache first to avoid duplicate API calls
        const cacheKey = getCollectionCacheKey(slug);
        const cachedData = getCachedData<any>(cacheKey);
        
        if (cachedData) {
          const col = cachedData.collection;
          const prods: any[] = cachedData.products || [];

          setCollection({
            id: String(col._id),
            name: col.name,
            description: col.description || '',
            slug: col.slug,
            heroImage: col.heroImage,
          });

          const mapped: Product[] = prods.map((p) => ({
            id: p.slug || String(p._id),
            name: p.name,
            image: p.image || '',
            price: p.price || 0,
            originalPrice: p.originalPrice,
            rating: p.rating || 0,
            reviewCount: p.reviewCount || 0,
            brand: p.brand || p.category || 'Unknown',
            inStock: p.inStock !== false,
            badge: p.badge,
            discount: p.discount,
          }));

          setProducts(mapped);
          setLoading(false);
          loadingRef.current = null;
          return;
        }

        const res = await fetch(`/api/collections/${encodeURIComponent(slug)}`);

        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch collection');

        const data = await res.json();
        
        // Cache the response to prevent duplicate calls
        setCachedData(cacheKey, data, 5 * 60 * 1000); // 5 minutes cache
        
        const col = data.collection;
        const prods: any[] = data.products || [];

        setCollection({
          id: String(col._id),
          name: col.name,
          description: col.description || '',
          slug: col.slug,
          heroImage: col.heroImage,
        });

        const mapped: Product[] = prods.map((p) => ({
          id: p.slug || String(p._id),  // prefer slug for clean URLs, fall back to _id
          name: p.name,
          image: p.image || '',
          price: p.price || 0,
          originalPrice: p.originalPrice,
          rating: p.rating || 0,
          reviewCount: p.reviewCount || 0,
          brand: p.brand || p.category || 'Unknown',
          inStock: p.inStock !== false,
          badge: p.badge,
          discount: p.discount,
        }));

        setProducts(mapped);
        loadingRef.current = null;
      } catch (error) {
        console.error('Failed to load collection:', error);
        loadingRef.current = null;
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Apply filters
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Price filter
    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Brand filter
    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }

    // Rating filter
    if (filters.minRating > 0) {
      result = result.filter((p) => p.rating >= filters.minRating);
    }

    // Stock filter
    if (filters.inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    return result;
  }, [products, filters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.reverse();
      case 'discount':
        return sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      case 'popularity':
      default:
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [filteredProducts, sortBy]);

  // Paginate
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Loading state ──────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="max-w-[1440px] mx-auto w-full min-w-0 px-3 sm:px-4 md:px-6 py-4 sm:py-6 overflow-x-hidden">
          <CollectionDetailSkeleton />
        </main>
        <Footer />
      </>
    );
  }

  // ── 404 state ──────────────────────────────────────────────────
  if (notFound || !collection) {
    return (
      <>
        <Navbar />
        <main className="max-w-[1440px] mx-auto w-full min-w-0 px-3 sm:px-4 md:px-6 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">collections</span>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Collection Not Found</h1>
            <p className="text-gray-600 mb-6">
              The collection you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/collections"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Collections
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Main page (mirrors /products UI exactly) ───────────────────
  return (
    <>
      {/* Schema Markup */}
      {!loading && products.length > 0 && (
        <>
          <ProductListSchema
            products={products.map(p => ({
              id: p.id,
              name: p.name,
              image: p.image,
              price: p.price,
              currency: 'INR',
              inStock: p.inStock,
              category: p.brand,
              brand: p.brand,
              rating: p.rating,
              reviewCount: p.reviewCount,
            }))}
            pageUrl={`/collections/${slug}`}
            pageTitle={collection.name}
            pageDescription={collection.description}
          />
          <BreadcrumbSchema
            items={[
              { label: 'Home', href: '/' },
              { label: 'Collections', href: '/collections' },
              { label: collection.name },
            ]}
          />
        </>
      )}
      <Navbar />
      <main className="max-w-[1440px] mx-auto w-full min-w-0 px-3 sm:px-4 md:px-6 py-4 sm:py-6 overflow-x-hidden">

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Collections', href: '/collections' },
            { label: collection.name },
          ]}
        />

        {/* Hero banner (only when the collection has an image) */}
        {collection.heroImage && (
          <div className="relative w-full h-40 md:h-52 rounded-2xl overflow-hidden mb-6">
            <img
              src={collection.heroImage}
              alt={collection.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <div className="absolute inset-0 flex items-center px-8">
              <p className="text-white/80 text-base md:text-lg max-w-lg">{collection.description}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 items-start">
          {/* ── Sidebar Filters (identical to /products) ── */}
          <ProductFilters onFilterChange={handleFilterChange} />

          {/* ── Main Product Area ── */}
          <div className="flex-1 min-w-0">
            {/* Grid Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-black text-primary mb-2">{collection.name}</h1>
                {collection.description && !collection.heroImage && (
                  <p className="text-slate-500 font-medium mb-1">{collection.description}</p>
                )}
                <p className="text-slate-500 font-medium">
                  {sortedProducts.length === 0
                    ? 'No products match your filters'
                    : <>
                        Showing{' '}
                        {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, sortedProducts.length)}–
                        {Math.min(currentPage * ITEMS_PER_PAGE, sortedProducts.length)} of{' '}
                        {sortedProducts.length} results
                      </>
                  }
                </p>
              </div>
              <ProductSort sortBy={sortBy} onSortChange={handleSortChange} />
            </div>

            {/* Product Grid */}
            {paginatedProducts.length > 0 ? (
              <ProductGrid products={paginatedProducts} collectionSlug={slug} />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
                  inventory_2
                </span>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No products match your filters</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting or clearing your filters to see more products in this collection.
                </p>
                <button
                  onClick={() => {
                    setFilters({ priceRange: [500, 50000], brands: [], minRating: 0, inStockOnly: false });
                    setCurrentPage(1);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
