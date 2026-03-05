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

      // Load all products from admin products API
      const loadProducts = async () => {
        try {
          const res = await fetch('/api/admin/products');
          if (!res.ok) return;
          const data: any[] = await res.json();
          const mapped: Product[] =
            data?.map((p) => ({
              id: p.slug || p._id,  // prefer slug for clean URLs
              name: p.name,
              image: p.image,
              price: p.price,
              originalPrice: undefined,
              brand: p.category || 'JioCoder',
              rating: 4.5,
              reviewCount: 0,
            })) || [];
          setAllProducts(mapped);
        } catch (error) {
          console.error('Failed to load products for best sellers', error);
        }
      };

      void loadProducts();
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

