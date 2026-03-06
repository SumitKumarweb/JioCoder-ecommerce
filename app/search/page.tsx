'use client';

import { useState, useMemo, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import ProductGrid, { Product } from '@/components/ProductGrid';
import ProductFilters, { FilterState } from '@/components/ProductFilters';
import ProductSort, { SortOption } from '@/components/ProductSort';
import Pagination from '@/components/Pagination';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import NoSearchResults from '@/components/NoSearchResults';
import { getCachedData, setCachedData } from '@/utils/apiCache';
import Link from 'next/link';

const ITEMS_PER_PAGE = 12;

type SearchResultType = 'all' | 'products' | 'blogs' | 'collections';

interface BlogResult {
  id: string;
  title: string;
  slug: string;
  description?: string;
  summary?: string;
  featuredImage?: string;
  category?: string;
  publishedAt?: string;
  score?: number;
}

interface CollectionResult {
  id: string;
  name: string;
  slug: string;
  description?: string;
  heroImage?: string;
  isFeatured?: boolean;
  score?: number;
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <main className="max-w-[1440px] mx-auto w-full min-w-0 px-3 sm:px-4 md:px-6 py-8">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
                <p className="text-gray-600">Loading search...</p>
              </div>
            </div>
          </main>
          <Footer />
        </>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || searchParams.get('search') || '';
  const typeParam = searchParams.get('type') as SearchResultType || 'all';

  const [activeTab, setActiveTab] = useState<SearchResultType>(typeParam);
  const [products, setProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<BlogResult[]>([]);
  const [collections, setCollections] = useState<CollectionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [500, 50000],
    brands: [],
    minRating: 0,
    inStockOnly: false,
  });
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const loadingRef = useRef(false);

  // Update search input when URL changes
  useEffect(() => {
    setSearchInput(searchQuery);
    setActiveTab(typeParam);
  }, [searchQuery, typeParam]);

  // Load search results
  useEffect(() => {
    if (!searchQuery.trim()) {
      setLoading(false);
      return;
    }

    if (loadingRef.current) return;

    const performSearch = async () => {
      loadingRef.current = true;
      setLoading(true);

      try {
        // Search products
        if (activeTab === 'all' || activeTab === 'products') {
          const cacheKey = `search:products:${searchQuery}`;
          const cachedData = getCachedData<Product[]>(cacheKey);

          if (cachedData) {
            setProducts(cachedData);
          } else {
            const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}&limit=100`);
            if (res.ok) {
              const data: { results: any[] } = await res.json();
              const mapped: Product[] = (data.results || []).map((p) => ({
                id: p.slug || p._id,
                name: p.name,
                image: p.image || '/placeholder-product.png',
                price: p.price,
                originalPrice: undefined,
                rating: 4.5,
                reviewCount: 0,
                brand: p.category || 'JioCoder',
                inStock: p.inStock ?? true,
              }));
              setCachedData(cacheKey, mapped, 2 * 60 * 1000);
              setProducts(mapped);
            }
          }
        }

        // Search blogs and collections (using general search API)
        if (activeTab === 'all' || activeTab === 'blogs' || activeTab === 'collections') {
          try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=20`);
            if (res.ok) {
              const data: { results: any[] } = await res.json();
              const blogResults: BlogResult[] = [];
              const collectionResults: CollectionResult[] = [];

              (data.results || []).forEach((result) => {
                if (result.type === 'blog') {
                  blogResults.push({
                    id: result.id,
                    title: result.title,
                    slug: result.slug,
                    description: result.description,
                    summary: result.summary,
                    featuredImage: result.featuredImage,
                    category: result.category,
                    publishedAt: result.publishedAt,
                    score: result.score,
                  });
                } else if (result.type === 'collection') {
                  collectionResults.push({
                    id: result.id,
                    name: result.title,
                    slug: result.slug,
                    description: result.description,
                    heroImage: result.heroImage,
                    isFeatured: result.isFeatured,
                    score: result.score,
                  });
                }
              });

              setBlogs(blogResults);
              setCollections(collectionResults);
            }
          } catch (error) {
            console.error('Error searching blogs/collections:', error);
          }
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    };

    performSearch();
  }, [searchQuery, activeTab]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}&type=${activeTab}`);
    }
  };

  // Handle tab change
  const handleTabChange = (tab: SearchResultType) => {
    setActiveTab(tab);
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}&type=${tab}`);
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

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
  }, [products, filters]);

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

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedProducts.slice(startIndex, endIndex);
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

  const totalResults = 
    (activeTab === 'all' || activeTab === 'products' ? products.length : 0) +
    (activeTab === 'all' || activeTab === 'blogs' ? blogs.length : 0) +
    (activeTab === 'all' || activeTab === 'collections' ? collections.length : 0);

  // Show empty state if no query
  if (!searchQuery.trim()) {
    return (
      <>
        <Navbar />
        <main className="max-w-[1440px] mx-auto w-full min-w-0 px-3 sm:px-4 md:px-6 py-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Search' },
            ]}
          />
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="mb-8">
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
                search
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Search Products, Blogs & Collections</h1>
            <p className="text-slate-600 mb-8">
              Enter a search term to find products, blog posts, and collections
            </p>
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search for anything..."
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Show no results
  if (!loading && totalResults === 0) {
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
      <main className="max-w-[1440px] mx-auto w-full min-w-0 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Search', href: '/search' },
            { label: `"${searchQuery}"` },
          ]}
        />

        {/* Search Header */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-2 max-w-2xl">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for anything..."
                className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-200 focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Search Results for "{searchQuery}"
              </h1>
              <p className="text-slate-600 mt-1">
                Found {totalResults} {totalResults === 1 ? 'result' : 'results'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-6">
          <div className="flex gap-4">
            {(['all', 'products', 'blogs', 'collections'] as SearchResultType[]).map((tab) => {
              const count =
                tab === 'all' ? totalResults :
                tab === 'products' ? products.length :
                tab === 'blogs' ? blogs.length :
                collections.length;

              return (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-4 py-2 font-semibold text-sm border-b-2 transition-colors capitalize ${
                    activeTab === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="py-12">
            <ProductGridSkeleton count={12} />
          </div>
        ) : (
          <>
            {/* Products Tab */}
            {(activeTab === 'all' || activeTab === 'products') && (
              <div className="mb-12">
                {products.length > 0 ? (
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Filters Sidebar */}
                    <div className="lg:w-64 shrink-0">
                      <ProductFilters onFilterChange={handleFilterChange} />
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-slate-600">
                          Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, sortedProducts.length)}-
                          {Math.min(currentPage * ITEMS_PER_PAGE, sortedProducts.length)} of{' '}
                          {sortedProducts.length} products
                        </p>
                        <ProductSort sortBy={sortBy} onSortChange={handleSortChange} />
                      </div>

                      <ProductGrid products={paginatedProducts} />

                      {totalPages > 1 && (
                        <div className="mt-8">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : activeTab === 'products' ? (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
                      inventory_2
                    </span>
                    <p className="text-slate-600">No products found</p>
                  </div>
                ) : null}
              </div>
            )}

            {/* Blogs Tab */}
            {(activeTab === 'all' || activeTab === 'blogs') && blogs.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Blog Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {blog.featuredImage && (
                        <div className="aspect-video overflow-hidden bg-slate-100">
                          <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        {blog.category && (
                          <span className="text-xs font-semibold text-primary uppercase">
                            {blog.category}
                          </span>
                        )}
                        <h3 className="font-bold text-lg text-slate-900 mt-2 group-hover:text-primary transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        {(blog.description || blog.summary) && (
                          <p className="text-slate-600 text-sm mt-2 line-clamp-2">
                            {blog.description || blog.summary}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Collections Tab */}
            {(activeTab === 'all' || activeTab === 'collections') && collections.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Collections</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collections.map((collection) => (
                    <Link
                      key={collection.id}
                      href={`/collections/${collection.slug}`}
                      className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {collection.heroImage && (
                        <div className="aspect-video overflow-hidden bg-slate-100">
                          <img
                            src={collection.heroImage}
                            alt={collection.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors">
                          {collection.name}
                        </h3>
                        {collection.description && (
                          <p className="text-slate-600 text-sm mt-2 line-clamp-2">
                            {collection.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

