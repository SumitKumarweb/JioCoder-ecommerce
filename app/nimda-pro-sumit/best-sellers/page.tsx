'use client';

import { useState, useEffect } from 'react';

interface BestSellerProduct {
  id: string;
  productId: string; // Reference to product ID
  badge?: string;
  order: number; // For ordering
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

export default function BestSellersPage() {
  const [bestSellers, setBestSellers] = useState<BestSellerProduct[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load best sellers from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bestSellers');
      if (saved) {
        setBestSellers(JSON.parse(saved));
      } else {
        // Default best sellers
        const defaultBestSellers: BestSellerProduct[] = [
          { id: 'bs-1', productId: 'bestseller-1', badge: 'Save 15%', order: 1 },
          { id: 'bs-2', productId: 'bestseller-2', badge: 'Top Rated', order: 2 },
          { id: 'bs-3', productId: 'bestseller-3', badge: 'Best Deal', order: 3 },
          { id: 'bs-4', productId: 'bestseller-4', badge: 'Exclusive', order: 4 },
        ];
        setBestSellers(defaultBestSellers);
        localStorage.setItem('bestSellers', JSON.stringify(defaultBestSellers));
      }

      // Load all products (in real app, fetch from API)
      // For now, we'll use mock products that match the best sellers structure
      const products: Product[] = [
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
        {
          id: 'keyboard-1',
          name: 'Keychron K2 Keyboard',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYYaK_kJQeDLBQe_vIhIfpvQFrKWDFMzT5uCj-WYv4_Yrg8fBz0tLw3B9Di8OGJpUq6MS2iK7p15s5cKdz59YvQTQOjXTWOvBvyGTlzbKzJDwOAxraZuylCZ8xUVYoya5pU74k7JRqXqhvZ6r5ByCp17LNHrQHqlKOWtSEVRu-oZViU2TpmAJIJCSgq7dgdOEZzSbDpZZgpzybypXPIFAnmRFPQ9V99esFHJeUFY0OObx28cOWcU-chPhuaZDKDNKacxKTB2qZ9-Yb',
          price: 7499,
          originalPrice: 9999,
          brand: 'Keychron',
          rating: 4.5,
          reviewCount: 2400,
        },
      ];
      setAllProducts(products);
    }
  }, []);

  const isBestSeller = (productId: string) => {
    return bestSellers.some((bs) => bs.productId === productId);
  };

  const getBestSellerBadge = (productId: string) => {
    const bs = bestSellers.find((b) => b.productId === productId);
    return bs?.badge || '';
  };

  const handleToggleBestSeller = (productId: string) => {
    const existing = bestSellers.find((bs) => bs.productId === productId);
    let updated: BestSellerProduct[];

    if (existing) {
      // Remove from best sellers
      updated = bestSellers.filter((bs) => bs.productId !== productId);
      // Reorder remaining items
      updated = updated.map((bs, index) => ({ ...bs, order: index + 1 }));
    } else {
      // Add to best sellers
      const newBestSeller: BestSellerProduct = {
        id: `bs-${Date.now()}`,
        productId,
        badge: '',
        order: bestSellers.length + 1,
      };
      updated = [...bestSellers, newBestSeller];
    }

    setBestSellers(updated);
    localStorage.setItem('bestSellers', JSON.stringify(updated));
  };

  const handleUpdateBadge = (productId: string, badge: string) => {
    const updated = bestSellers.map((bs) =>
      bs.productId === productId ? { ...bs, badge } : bs
    );
    setBestSellers(updated);
    localStorage.setItem('bestSellers', JSON.stringify(updated));
  };

  const handleReorder = (index: number, direction: 'up' | 'down') => {
    const updated = [...bestSellers];
    if (direction === 'up' && index > 0) {
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      updated[index - 1].order = index;
      updated[index].order = index + 1;
    } else if (direction === 'down' && index < updated.length - 1) {
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      updated[index].order = index + 1;
      updated[index + 1].order = index + 2;
    }
    setBestSellers(updated);
    localStorage.setItem('bestSellers', JSON.stringify(updated));
  };

  const filteredProducts = allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const bestSellerProducts = bestSellers
    .sort((a, b) => a.order - b.order)
    .map((bs) => {
      const product = allProducts.find((p) => p.id === bs.productId);
      return product ? { ...bs, product } : null;
    })
    .filter((item): item is BestSellerProduct & { product: Product } => item !== null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Best Sellers Management</h1>
          <p className="text-gray-600 mt-1">Select products to feature as best sellers on homepage</p>
        </div>
      </div>

      {/* Current Best Sellers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">
            Current Best Sellers ({bestSellerProducts.length})
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Drag or use arrows to reorder. Products appear in this order on the homepage.
          </p>
        </div>
        {bestSellerProducts.length > 0 ? (
          <div className="p-6 space-y-4">
            {bestSellerProducts.map((bs, index) => (
              <div
                key={bs.id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleReorder(index, 'up')}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <span className="material-symbols-outlined text-sm">keyboard_arrow_up</span>
                  </button>
                  <button
                    onClick={() => handleReorder(index, 'down')}
                    disabled={index === bestSellerProducts.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                  </button>
                </div>
                <div className="flex-shrink-0">
                  <img
                    src={bs.product.image}
                    alt={bs.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase font-bold">{bs.product.brand}</p>
                      <h3 className="font-semibold text-gray-900">{bs.product.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        ₹{bs.product.price.toLocaleString()}
                        {bs.product.originalPrice && (
                          <span className="text-gray-400 line-through ml-2">
                            ₹{bs.product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Badge (optional)</label>
                        <input
                          type="text"
                          value={bs.badge || ''}
                          onChange={(e) => handleUpdateBadge(bs.productId, e.target.value)}
                          placeholder="e.g., Save 15%"
                          className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        onClick={() => handleToggleBestSeller(bs.productId)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
              star
            </span>
            <p className="text-gray-500">No best sellers selected yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Select products from the list below to add them as best sellers
            </p>
          </div>
        )}
      </div>

      {/* Available Products */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-3">Select Products</h2>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search products by name or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredProducts
              .filter((p) => !isBestSeller(p.id))
              .map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleToggleBestSeller(product.id)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase font-bold">{product.brand}</p>
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      ₹{product.price.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleBestSeller(product.id);
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                  </button>
                </div>
              ))}
          </div>
          {filteredProducts.filter((p) => !isBestSeller(p.id)).length === 0 && (
            <p className="text-center text-gray-500 py-8">
              {searchQuery ? 'No products found' : 'All products are already best sellers'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

