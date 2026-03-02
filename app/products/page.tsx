'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import ProductFilters, { FilterState } from '@/components/ProductFilters';
import ProductGrid, { Product } from '@/components/ProductGrid';
import ProductSort, { SortOption } from '@/components/ProductSort';
import Pagination from '@/components/Pagination';
import NoSearchResults from '@/components/NoSearchResults';

// Sample product data
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
  {
    id: 'keyboard-3',
    name: 'Razer BlackWidow V4 Pro - Wired Mechanical Gaming Keyboard',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAS59MUEXh5N0DoJaIdeXwNwD1LGPeXpqEVA0gT3lkoZUa4HRR2mCmM3Po5tke9Za9nmh6XiwsU8rIRnBFBnnbVE5LMvdMDD7NIvLg2Qg2SC6r5jASnqFEDsg1VKZg6NRMklHgp6Y3Gwqrfq4udscbkJXLW4F4ORvxjqbx28xO-YenU2EKo5UAa3XnMvWgOmV81Rfq_ILUBKhv8-6RCJbpC26l2gTJk-HanaOHEX1V1t44lyrh01ijJGQF0AWXsSvHavsWke03HY13',
    price: 22499,
    rating: 4,
    reviewCount: 128,
    badge: { text: 'New Arrival', color: 'green' },
    brand: 'Razer',
    inStock: true,
  },
  {
    id: 'keyboard-4',
    name: 'Zebronics Nitro Mechanical Keyboard with Blue Switches',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZNsIP1JJIDCULhFFOPEqVSCYrky1goaw05IyTO6v0Qg8Iq0f8fP_584BIrA6eK1E50ppyPbzL6Br8Tw9Hj7H4jjFMdXS8GRwddWVzjVSrZFo7OBYieDLfEiduX3MUTFDErzOLJ8bWnnt1vsnxtvaT-PbuZ4Vuj-sCwcoeHX4-dO8JVXFoutoADeIZLfn4PqL9gvb_gcVqEEIYYnWZI14KxhEVk4DKxdy0_HeFtGYlJkelk6xmmS8VDZ1Q_fx_06vQYhUunvgdOqog',
    price: 2499,
    originalPrice: 4199,
    rating: 4.5,
    reviewCount: 15000,
    badge: { text: '-40%', color: 'red' },
    discount: 40,
    brand: 'Zebronics',
    inStock: true,
  },
  {
    id: 'keyboard-5',
    name: 'TVS-Gold Bharat USB Wired Mechanical Keyboard',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv7diH_jsOvKWsVWNLm9SjogcAexMdfW54gdEjThb36gkwFGBylahxLY4h8fd3DB7iAPcQXZNXucrP2EhuE7TOPS3K-tMPEqm4rSxFa6HXrI-upjyECuXGAdw62dXn8QJhAmzQ18GZNRTROD3VdZITs0z42Ca1hHB0N7rLnivp9MdtSZy9makZoB0zxiRMU0DbkdOGErZo8ji3XO0o7XmjkNhY-XRm20MnzrRmMA6ejv_qesZ8MXrpEQ24OpnByCkX6Iz9Giz84YoA',
    price: 2650,
    rating: 5,
    reviewCount: 45000,
    brand: 'TVS Gold',
    inStock: true,
  },
  {
    id: 'keyboard-6',
    name: 'Logitech G915 TKL Tenkeyless Lightspeed Wireless RGB',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgkg93ONA_IxvSv-l0E-2eLSWDKcKJS-u2y9MjXifgeZ3555IrfLN6LgOwnywFsyYX9_GIjgD1McoIcAPnTaU42e3nDU0kzwaaoS5VKFbH8tgDy7pl5vJDc2G_c_MNfT-GSYYl32XntdqGjetSr2Q3vxGxt1sbVMcqfxdPAYBx_BTGnXfo15J74gmv4KAOl0Z_x31r60CJZRAlSarLDfP2EfkwWEFybLU3oVlS-4GhfocDl9cO7wchRCdmveoVWo4sjc1M29toiG95',
    price: 19995,
    originalPrice: 23995,
    rating: 4,
    reviewCount: 892,
    badge: { text: '-15%', color: 'red' },
    discount: 15,
    brand: 'Logitech',
    inStock: true,
  },
];

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || searchParams.get('search') || '';

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [500, 50000],
    brands: [],
    minRating: 0,
    inStockOnly: false,
  });
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query)
      );
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
  }, [filters, searchQuery]);

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
  if (searchQuery && sortedProducts.length === 0) {
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
            <ProductGrid products={paginatedProducts} />

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

