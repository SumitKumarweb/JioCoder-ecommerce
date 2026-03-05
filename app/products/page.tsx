'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import ProductFilters, { FilterState } from '@/components/ProductFilters';
import ProductGrid, { Product } from '@/components/ProductGrid';
import ProductSort, { SortOption } from '@/components/ProductSort';
import Pagination from '@/components/Pagination';
import NoSearchResults from '@/components/NoSearchResults';

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <main className="max-w-[1440px] mx-auto w-full min-w-0 px-3 sm:px-4 md:px-6 py-8">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          </main>
          <Footer />
        </>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [500, 50000],
    brands: [],
    minRating: 0,
    inStockOnly: false,
  });
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status}`);
        }
        const data: any[] = await res.json();
        const mapped: Product[] =
          data?.map((p) => ({
            id: p._id,
            name: p.name,
            image: p.image,
            price: p.price,
            originalPrice: undefined,
            rating: 4.5,
            reviewCount: 0,
            brand: p.category || 'JioCoder',
            inStock: p.inStock,
          })) || [];
        setProducts(mapped);
      } catch (error) {
        console.error('Failed to load products from API', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter with simple "similar word" support (handles plurals / partial matches)
    if (searchQuery) {
      const haystackForProduct = (product: Product) =>
        `${product.name} ${product.brand}`.toLowerCase();

      const tokens = searchQuery
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

      result = result.filter((product) => {
        const haystack = haystackForProduct(product);

        // Every token must loosely match (substring, with basic plural handling)
        return tokens.every((token) => {
          if (haystack.includes(token)) return true;

          // Basic plural/singular normalization (keyboard <-> keyboards)
          const singular = token.endsWith('s') ? token.slice(0, -1) : token;
          const plural = token.endsWith('s') ? token : `${token}s`;

          return haystack.includes(singular) || haystack.includes(plural);
        });
      });
    }

    // Price filter
    result = result.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Brand filter
    if (filters.brands.length > 0) {
      result = result.filter((product) => filters.brands.includes(product.brand));
    }

    // Rating filter
    if (filters.minRating > 0) {
      result = result.filter((product) => product.rating >= filters.minRating);
    }

    // Stock filter
    if (filters.inStockOnly) {
      result = result.filter((product) => product.inStock);
    }

    return result;
  }, [filters, searchQuery, products]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        // Assuming newer products have higher IDs or we could add a date field
        return sorted.reverse();
      case 'discount':
        return sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      case 'popularity':
      default:
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [filteredProducts, sortBy]);

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedProducts.slice(startIndex, endIndex);
  }, [sortedProducts, currentPage]);

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

  // Reset to page 1 when filters or sort change
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

  // Show NoSearchResults if search query exists but no results found
  if (!loading && searchQuery && sortedProducts.length === 0) {
    return (
      <>
        <Navbar />
        <NoSearchResults searchQuery={searchQuery} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-[1440px] mx-auto w-full min-w-0 px-3 sm:px-4 md:px-6 py-4 sm:py-6 overflow-x-hidden">
        {/* Breadcrumbs */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Computing', href: '/computing' },
            { label: 'Keyboards' },
          ]}
        />

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 items-start">
          {/* Sidebar Filters */}
          <ProductFilters onFilterChange={handleFilterChange} />

          {/* Main Product Area */}
          <div className="flex-1">
            {/* Grid Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-black text-primary mb-2">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'Mechanical & Wireless Keyboards'}
                </h1>
                <p className="text-slate-500 font-medium">
                  Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, sortedProducts.length)}-
                  {Math.min(currentPage * ITEMS_PER_PAGE, sortedProducts.length)} of{' '}
                  {sortedProducts.length} results for your selection
                </p>
              </div>
              <ProductSort sortBy={sortBy} onSortChange={handleSortChange} />
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : (
              <ProductGrid products={paginatedProducts} />
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

