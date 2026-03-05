'use client';

import { useState, useEffect } from 'react';
import { useCompare } from '@/contexts/CompareContext';
import { useCart } from '@/contexts/CartContext';

interface BestSellerProduct {
  id: string;
  productId: string;
  badge?: string;
  order: number;
}

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  brand: string;
  rating?: number;
  reviewCount?: number;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`material-symbols-outlined text-sm ${
            star <= rating ? 'fill-1' : 'fill-0'
          }`}
        >
          star
        </span>
      ))}
    </div>
  );
};

export default function BestSellers() {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { addToCart } = useCart();
  const [bestSellers, setBestSellers] = useState<Array<Product & { badge?: string }>>([]);

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch BEST_SELLER section products from public API
        const res = await fetch('/api/section-products?sectionType=BEST_SELLER');
        if (!res.ok) return;
        const data: any[] = await res.json();

        const mapped =
          (data ?? [])
            .map((item) => {
              const p = item.product;
              if (!p) return null;
              return {
                id: p.slug || p._id,  // prefer slug for clean URLs
                name: p.name,
                image: p.image,
                price: p.price,
                originalPrice: undefined,
                brand: p.category || 'JioCoder',
                rating: 4.5,
                reviewCount: 0,
                badge: item.badge,
              } as Product & { badge?: string };
            })
            .filter(
              (x: Product & { badge?: string } | null): x is Product & { badge?: string } =>
                x !== null
            );

        setBestSellers(mapped);
      } catch (error) {
        console.error('Failed to load best sellers', error);
      }
    };

    void load();
  }, []);

  const handleCompareChange = (product: Product & { badge?: string }, checked: boolean) => {
    if (checked) {
      addToCompare({
        id: product.id,
        name: product.name,
        image: product.image,
        price: `₹${product.price.toLocaleString()}`,
      });
    } else {
      removeFromCompare(product.id);
    }
  };

  if (bestSellers.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <h3 className="text-2xl font-bold tracking-tight">Best Sellers</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {bestSellers.map((product) => (
          <a
            key={product.id}
            href={`/product/${product.id}`}
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 flex flex-col transition-all hover:shadow-xl hover:-translate-y-1 group"
          >
            <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
              <img
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={product.image}
              />
              <button
                onClick={(e) => e.preventDefault()}
                className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-slate-900 hover:bg-white transition-colors z-10"
              >
                <span className="material-symbols-outlined text-xl">favorite</span>
              </button>
            </div>
            <div className="p-5 flex-1 flex flex-col space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                    {product.brand}
                  </p>
                  <h4 className="font-semibold text-lg line-clamp-1">{product.name}</h4>
                </div>
                {product.badge && (
                  <span className="bg-accent-green/10 text-accent-green text-xs font-bold px-2 py-1 rounded">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <StarRating rating={product.rating || 0} />
                <span className="text-xs text-slate-500 ml-1">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>
              <div className="mt-auto pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                    id={`compare-${product.id}`}
                    type="checkbox"
                    checked={isInCompare(product.id)}
                    onChange={(e) => handleCompareChange(product, e.target.checked)}
                  />
                  <label
                    className="text-xs font-medium text-slate-600 cursor-pointer"
                    htmlFor={`compare-${product.id}`}
                  >
                    Add to compare
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-slate-400 line-through text-sm ml-2">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart({
                        id: product.id,
                        name: product.name,
                        image: product.image,
                        price: product.price,
                      });
                    }}
                    className="bg-primary text-white p-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                  </button>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

