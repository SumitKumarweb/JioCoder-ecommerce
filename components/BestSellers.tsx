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
    // Load best sellers from localStorage (in real app, this would be an API call)
    if (typeof window !== 'undefined') {
      const savedBestSellers = localStorage.getItem('bestSellers');
      const bestSellerConfigs: BestSellerProduct[] = savedBestSellers
        ? JSON.parse(savedBestSellers)
        : [
            { id: 'bs-1', productId: 'bestseller-1', badge: 'Save 15%', order: 1 },
            { id: 'bs-2', productId: 'bestseller-2', badge: 'Top Rated', order: 2 },
            { id: 'bs-3', productId: 'bestseller-3', badge: 'Best Deal', order: 3 },
            { id: 'bs-4', productId: 'bestseller-4', badge: 'Exclusive', order: 4 },
          ];

      // Mock products data (should match admin products)
      const allProducts: Product[] = [
        {
          id: 'bestseller-1',
          name: 'K2 Wireless Mechanical Keyboard',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVA_-B12wrZHmkzZ0JS_w6YqBEeiWUHL-yo3FEwx9c9gXaJTZSRmBDVKQi4WgAoT1pgIxToDSiT6FRcVKmxerqeO-f9IYBLjIf0ZuyfqFNRhxhDS5Kuo3dGmO2L1BWOd88iu9s6hysFVNVyYWJ_qsjVHKMTsKJeYiMca5mmQ-CvDEDa-H62n7_lAGLE0RXrB0xGRSjU24V7KGl_DwmxjY830FIxC9VpaX14WXWTlwTLNARvo7gzXP97WcgP6hiEXeD8KwXmgJVHRyT',
          price: 8499,
          originalPrice: 9999,
          brand: 'Keychron',
          rating: 4,
          reviewCount: 128,
        },
        {
          id: 'bestseller-2',
          name: 'MX Master 3S Wireless',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKPTnPR2ZYt_a6VaISccTem49dOMrTwIeqIByZotD0MSDbynXY1x4jRH3kg8-Zh-qrbNn1w0WLg2nfSAzcB8STxJNCIKxO5SUb6EHtAd-_H9SntE78Ey0byBkeSf2PMVLS-ndiYmeQaWRKT5ZdiF4DIJh837aYSuixZD12MhQQN2TxFwEvl014VM1X3bhPHDJmuFIxzRrjbiYKMIu6nIdy13CpeF94iJsBTtzZLSLKI4FKoZrqif0csbfYmFwMxn0qhzkkrBNVyjWB',
          price: 9995,
          originalPrice: 10995,
          brand: 'Logitech',
          rating: 5,
          reviewCount: 450,
        },
        {
          id: 'bestseller-3',
          name: 'Model O- Lightweight Mouse',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXnDBW3fSizAUrZ3rDyY0N8oBsxZTcTyXhEnkE-quqlp2znS6pBe13Nc6ooE1Y67L5DivsQxEUa1YeI9BY2KEeGEz4bziPlw29DdC3AlrEGO7RWx9xG7voi8pKEz0xKLSAL_eCZrN5rKS1ufnWR1If-JnGZbDfz2os0oftjy-7YvpN73BhPYBFUYonV0HU6KDUBEvEwblDHfIZpQb5a4YXQbP_jbeIBsY1hnxyPdXNd7WCrbn3PFzswOpEVckWI2HmHDPhhu-Ki7qG',
          price: 4299,
          originalPrice: 5999,
          brand: 'Glorious',
          rating: 4,
          reviewCount: 89,
        },
        {
          id: 'bestseller-4',
          name: 'Pro Coiled Aviator Cable',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgdShxLlKCypMs41C4ireig29gMbYTcanzcugGp8t-hCCcH_Bbydd3W8vCLPbdtGLpSXlecsJdUMyEZ-R4i7d56copAT6erQtq1DkZiY77ZFMnlBetA9tX24i75RATOLlC7Agaffx_2fpn0jNJndIDhahEGWK-Imu1QevPVpOZSfabGlFPLjePlxNSS2hp3EGuNRrsoQsDtjEYf_jq9pwnJHYLnQ9yCq8HZLNBS9Ivrh3oJH5kktTCbvODwFUo5iwnmnjxVUCx-0NL',
          price: 1999,
          originalPrice: 2499,
          brand: 'JioCoder Custom',
          rating: 5,
          reviewCount: 56,
        },
      ];

      // Map best seller configs to products
      const sortedConfigs = [...bestSellerConfigs].sort((a, b) => a.order - b.order);
      const mappedProducts = sortedConfigs
        .map((config) => {
          const product = allProducts.find((p) => p.id === config.productId);
          return product ? { ...product, badge: config.badge } : null;
        })
        .filter((item): item is Product & { badge?: string } => item !== null);

      setBestSellers(mappedProducts);
    }
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

