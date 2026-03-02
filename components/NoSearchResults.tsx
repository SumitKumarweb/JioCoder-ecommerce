'use client';

import Link from 'next/link';
import ProductCard from './ProductCard';

interface NoSearchResultsProps {
  searchQuery?: string;
}

const recommendedProducts = [
  {
    id: 'search-rec-1',
    name: 'Huntsman V3 Pro TKL Analog Optical Keyboard',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcgpfHL_zGj3svqjZy8dv1urxgsl52aJIiXKarqgrtnxzr3To5Riv0QpBOsbWAt4BQNaYavI2uevhK4u85dtmyT2r-KE-UBiJmGw3C25mjaPWknCTj8ktxu0u5Pz7uxfeN86oTkboaVM3ZYBHtsbz1iZTYh2FerLy-7ZXPdd_sNN9hAqUIQTcl-SGsS-H8Fwug7Qd2h_39oanuEPEoUdwSrZZvJf2cBEDHKnwoVeyhPgodGITkN04Az09VvWodih9uhJlL-baY9qtt',
    price: 22999,
    rating: 4.5,
    reviewCount: 124,
    badge: { text: 'Bestseller', color: 'primary' },
  },
  {
    id: 'search-rec-2',
    name: 'MX Keys S Advanced Wireless Illuminated Keyboard',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9kM95kYBgIU9_hf8WYIND5YMgzsyuQ-ZI85-GD76ziCokcOy0lH1s7MGM3mZsqeWP5aYzoWz7FWYRZvfX_2Vvh-EbfKibKfp9VFcPzdIxj-_Cp3KKVvaO1EgEgOmPnHqupCtIBLHMx4V8xePlweryVG44RH6HOILcHMPgxP5aOcqm3SIXRn1KF-creIFurr7Wg79vIIOkAQn33r8K-l1QLKBZOwiJ3iauVbkH6x__EYqEud77lJuQUf44i6aJSnkMA11DlOk4bGgV',
    price: 12495,
    originalPrice: 14995,
    rating: 4,
    reviewCount: 452,
    badge: { text: 'Sale', color: 'red' },
    discount: 17,
  },
  {
    id: 'search-rec-3',
    name: 'QcK Heavy XXL Gaming Mouse Pad - Black',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGr4fPnGozs4ZVaWRewjPo4t_ZgE3xDQ1iSsvSReGxBKyAoHbWoj5qqSvEJ2s_6CcsX3G8du24VUzjSq3zTjFpHnDI9rPynYhwBh3VPtUJEGvDELGEKXYPznPxlOG6DOLmR6PMxTnxCeAIPrHfIhuy3B3iJ01dufMiQ5ZDd_1R_9JFWUv7TElmKvf6vkKeoQz9Y7hCB82ul29O4BcrkfmIk35RPfhCmAbihGKc8Gw8nuSEBWWrPOdXtc1PeNxjnHJnWWKaQhrY8KqV',
    price: 2899,
    rating: 5,
    reviewCount: 2100,
  },
  {
    id: 'search-rec-4',
    name: 'K70 RGB MK.2 Low Profile Mechanical Keyboard',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcndtiguWiJWKI_J9LLWxGfZ8nHj5at6hJYKUPn83YSt3IR3eBxB8C2gj3RgYu5NCCN6qsCdJIrAi3D8Ic0vHKWkfixFsDhGH8DqggB7CfyyNe3YQPCd6gQodaHFZQMzqjOhYOHyfJBquiKTi8quyJMCjhG4Fjdp4ulQcru1d1HGDtmI-PsksDA4NPIQUGRfQ3QCHaD0FXjxYx7zBcuCIiaEiV6KbvTMyXFel21VyVpHka7I-SqPX5C_prG38ZLWP8JlXQVfUT_BM7',
    price: 15200,
    rating: 4,
    reviewCount: 89,
    badge: { text: 'New', color: 'green' },
  },
];

export default function NoSearchResults({ searchQuery }: NoSearchResultsProps) {
  const handleClearSearch = () => {
    // Clear search query - in a real app, this would update the URL/search state
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/products');
      window.location.reload();
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-16">
      {/* No Results Hero Section */}
      <section className="flex flex-col items-center text-center py-10">
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center animate-pulse">
            <span className="material-symbols-outlined text-6xl text-slate-300">inventory_2</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-primary font-bold">search_off</span>
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
          No results found for{' '}
          <span className="text-primary">"{searchQuery || 'your search'}"</span>
        </h2>
        <p className="text-slate-600 max-w-lg mx-auto mb-8">
          We couldn't find any items matching your search. Please check your spelling or try more general keywords.
        </p>

        {/* Search Tips Card */}
        <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-8 text-left shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-primary">
            <span className="material-symbols-outlined">lightbulb</span>
            <h3 className="font-bold text-lg">Search Tips</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-accent-green mt-0.5">check_circle</span>
              <p className="text-slate-700">
                Check your spelling for typos (e.g., "Logitach" vs "Logitech")
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-accent-green mt-0.5">check_circle</span>
              <p className="text-slate-700">
                Try using more general keywords like "Keyboards" instead of specific models
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-accent-green mt-0.5">check_circle</span>
              <p className="text-slate-700">
                Browse by category or use filters to narrow down products
              </p>
            </li>
          </ul>
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-3">
            <button
              onClick={handleClearSearch}
              className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all"
            >
              Clear Search
            </button>
            <Link
              href="/"
              className="px-5 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="mt-20">
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-900">You Might Also Like</h2>
          <Link
            href="/products"
            className="text-primary font-semibold text-sm hover:underline flex items-center gap-1"
          >
            View all bestsellers
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              image={product.image}
              price={product.price}
              originalPrice={product.originalPrice}
              rating={product.rating}
              reviewCount={product.reviewCount}
              badge={product.badge}
              discount={product.discount}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

