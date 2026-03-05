'use client';

import { useState, useEffect } from 'react';

interface BestSellerItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    image: string;
    price: number;
    slug?: string;
    category?: string;
  };
  badge?: string;
  order: number;
}

interface Product {
  _id: string;
  id: string; // slug or _id for frontend
  name: string;
  image: string;
  price: number;
  slug?: string;
  category?: string;
}

export default function BestSellersPage() {
  const [bestSellers, setBestSellers] = useState<BestSellerItem[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load best sellers from MongoDB
  const loadBestSellers = async () => {
    try {
      const res = await fetch('/api/admin/section-products?sectionType=BEST_SELLER');
      if (!res.ok) throw new Error('Failed to fetch best sellers');
      const data: BestSellerItem[] = await res.json();
      setBestSellers(data || []);
    } catch (error) {
      console.error('Failed to load best sellers:', error);
      setSaveMessage({ type: 'error', text: 'Failed to load best sellers' });
    }
  };

  // Load all products
  const loadProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data: any[] = await res.json();
      const mapped: Product[] = data?.map((p) => ({
        _id: p._id,
        id: p.slug || p._id,
        name: p.name,
        image: p.image || '',
        price: p.price,
        slug: p.slug,
        category: p.category,
      })) || [];
      setAllProducts(mapped);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([loadBestSellers(), loadProducts()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Check if product is already a best seller
  const isBestSeller = (productId: string) => {
    return bestSellers.some((bs) => {
      const bsProductId = bs.product.slug || bs.product._id;
      return bsProductId === productId || bs.product._id === productId;
    });
  };

  // Toggle product selection
  const handleToggleSelection = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  // Add selected products to best sellers
  const handleAddSelected = async () => {
    if (selectedProducts.size === 0) {
      setSaveMessage({ type: 'error', text: 'Please select at least one product' });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const currentMaxOrder = bestSellers.length > 0 
        ? Math.max(...bestSellers.map(bs => bs.order))
        : 0;

      const promises = Array.from(selectedProducts).map(async (productId, index) => {
        // Find the product object
        const product = allProducts.find(p => p.id === productId || p._id === productId);
        if (!product) return null;

        // Check if already exists
        const existing = bestSellers.find(bs => {
          const bsProductId = bs.product.slug || bs.product._id;
          return bsProductId === productId || bs.product._id === productId;
        });

        if (existing) return null; // Skip if already exists

        const res = await fetch('/api/admin/section-products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product._id,
            sectionType: 'BEST_SELLER',
            order: currentMaxOrder + index + 1,
            badge: '',
          }),
        });

        if (!res.ok) throw new Error(`Failed to add product ${product.name}`);
        return res.json();
      });

      await Promise.all(promises);
      await loadBestSellers();
      setSelectedProducts(new Set());
      setSaveMessage({ type: 'success', text: `Added ${selectedProducts.size} product(s) to best sellers` });
    } catch (error) {
      console.error('Failed to add products:', error);
      setSaveMessage({ type: 'error', text: 'Failed to add products. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Remove product from best sellers
  const handleRemove = async (itemId: string) => {
    if (!confirm('Are you sure you want to remove this product from best sellers?')) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const res = await fetch(`/api/admin/section-products?id=${itemId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to remove product');
      
      await loadBestSellers();
      setSaveMessage({ type: 'success', text: 'Product removed successfully' });
    } catch (error) {
      console.error('Failed to remove product:', error);
      setSaveMessage({ type: 'error', text: 'Failed to remove product' });
    } finally {
      setIsSaving(false);
    }
  };

  // Update badge
  const handleUpdateBadge = async (itemId: string, badge: string) => {
    try {
      const res = await fetch('/api/admin/section-products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: itemId,
          badge: badge.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error('Failed to update badge');
      
      await loadBestSellers();
    } catch (error) {
      console.error('Failed to update badge:', error);
      setSaveMessage({ type: 'error', text: 'Failed to update badge' });
    }
  };

  // Reorder products
  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const sorted = [...bestSellers].sort((a, b) => a.order - b.order);
    
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sorted.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...sorted];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];

    // Update orders
    const updates = updated.map((item, idx) => ({
      id: item._id,
      order: idx + 1,
    }));

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const res = await fetch('/api/admin/section-products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error('Failed to reorder products');
      
      await loadBestSellers();
      setSaveMessage({ type: 'success', text: 'Products reordered successfully' });
    } catch (error) {
      console.error('Failed to reorder products:', error);
      setSaveMessage({ type: 'error', text: 'Failed to reorder products' });
    } finally {
      setIsSaving(false);
    }
  };

  // Save all changes (reorder and badges)
  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const sorted = [...bestSellers].sort((a, b) => a.order - b.order);
      const updates = sorted.map((item, idx) => ({
        id: item._id,
        order: idx + 1,
        badge: item.badge || undefined,
      }));

      const res = await fetch('/api/admin/section-products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error('Failed to save changes');
      
      await loadBestSellers();
      setSaveMessage({ type: 'success', text: 'All changes saved successfully!' });
    } catch (error) {
      console.error('Failed to save changes:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save changes. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = allProducts.filter(
    (product) =>
      !isBestSeller(product.id) &&
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.category || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedBestSellers = [...bestSellers].sort((a, b) => a.order - b.order);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
          <p className="text-gray-600">Loading best sellers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Best Sellers Management</h1>
          <p className="text-gray-600 mt-1">Select multiple products and save to feature them as best sellers on homepage</p>
        </div>
        {sortedBestSellers.length > 0 && (
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">save</span>
                Save All Changes
              </>
            )}
          </button>
        )}
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div
          className={`p-4 rounded-lg ${
            saveMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      {/* Current Best Sellers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">
            Current Best Sellers ({sortedBestSellers.length})
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Use arrows to reorder. Products appear in this order on the homepage. Click Save All Changes to persist.
          </p>
        </div>
        {sortedBestSellers.length > 0 ? (
          <div className="p-6 space-y-4">
            {sortedBestSellers.map((bs, index) => {
              const product = bs.product;
              return (
                <div
                  key={bs._id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleReorder(index, 'up')}
                      disabled={index === 0 || isSaving}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <span className="material-symbols-outlined text-sm">keyboard_arrow_up</span>
                    </button>
                    <button
                      onClick={() => handleReorder(index, 'down')}
                      disabled={index === sortedBestSellers.length - 1 || isSaving}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                    </button>
                  </div>
                  <div className="flex-shrink-0">
                    <img
                      src={product.image || '/placeholder-product.png'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase font-bold">{product.category || 'JioCoder'}</p>
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          ₹{product.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Badge (optional)</label>
                          <input
                            type="text"
                            value={bs.badge || ''}
                            onChange={(e) => {
                              const updated = sortedBestSellers.map(item =>
                                item._id === bs._id ? { ...item, badge: e.target.value } : item
                              );
                              setBestSellers(updated);
                            }}
                            onBlur={(e) => handleUpdateBadge(bs._id, e.target.value)}
                            placeholder="e.g., Save 15%"
                            className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <button
                          onClick={() => handleRemove(bs._id)}
                          disabled={isSaving}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
              star
            </span>
            <p className="text-gray-500">No best sellers selected yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Select products from the list below and click "Add Selected" to add them as best sellers
            </p>
          </div>
        )}
      </div>

      {/* Available Products */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Select Products</h2>
            {selectedProducts.size > 0 && (
              <button
                onClick={handleAddSelected}
                disabled={isSaving}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">add</span>
                    Add Selected ({selectedProducts.size})
                  </>
                )}
              </button>
            )}
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedProducts.has(product.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleToggleSelection(product.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedProducts.has(product.id)}
                  onChange={() => handleToggleSelection(product.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <img
                  src={product.image || '/placeholder-product.png'}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase font-bold">{product.category || 'JioCoder'}</p>
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    ₹{product.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              {searchQuery ? 'No products found' : 'All products are already best sellers'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
