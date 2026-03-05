'use client';

import { useState, useEffect } from 'react';

interface SectionProductItem {
  _id: string;
  product: {
    _id: string;
  name: string;
  image: string;
  price: number;
    slug?: string;
    category?: string;
  };
  sectionType: 'TRENDING' | 'SPOTLIGHT';
  order: number;
  description?: string;
  features?: Array<{
    icon: string;
    text: string;
  }>;
  hotspots?: Array<{
    position: {
      top?: string;
      bottom?: string;
      left?: string;
      right?: string;
    };
    title: string;
    description: string;
    color?: string;
  }>;
  buttonText?: string;
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

export default function SectionProductsPage() {
  const [trendingProducts, setTrendingProducts] = useState<SectionProductItem[]>([]);
  const [spotlightProduct, setSpotlightProduct] = useState<SectionProductItem | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedSection, setSelectedSection] = useState<'TRENDING' | 'SPOTLIGHT'>('TRENDING');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isEditingSpotlight, setIsEditingSpotlight] = useState(false);
  const [spotlightFormData, setSpotlightFormData] = useState<{
    description: string;
    features: Array<{ icon: string; text: string }>;
    hotspots: Array<{ position: { top?: string; bottom?: string; left?: string; right?: string }; title: string; description: string; color?: string }>;
    buttonText: string;
  }>({
    description: '',
    features: [],
    hotspots: [],
    buttonText: 'Pre-order Now',
  });

  // Load section products from MongoDB
  const loadSectionProducts = async () => {
    try {
      const [trendingRes, spotlightRes] = await Promise.all([
        fetch('/api/admin/section-products?sectionType=TRENDING'),
        fetch('/api/admin/section-products?sectionType=SPOTLIGHT'),
      ]);

      if (trendingRes.ok) {
        const trendingData: SectionProductItem[] = await trendingRes.json();
        setTrendingProducts(trendingData.sort((a, b) => a.order - b.order));
      }

      if (spotlightRes.ok) {
        const spotlightData: SectionProductItem[] = await spotlightRes.json();
        setSpotlightProduct(spotlightData.length > 0 ? spotlightData[0] : null);
      }
    } catch (error) {
      console.error('Failed to load section products:', error);
      setSaveMessage({ type: 'error', text: 'Failed to load section products' });
    }
  };

  // Load all products from MongoDB
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
      await Promise.all([loadSectionProducts(), loadProducts()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Load spotlight form data when spotlight product changes
  useEffect(() => {
    if (spotlightProduct) {
      setSpotlightFormData({
        description: spotlightProduct.description || '',
        features: spotlightProduct.features || [],
        hotspots: spotlightProduct.hotspots || [],
        buttonText: spotlightProduct.buttonText || 'Pre-order Now',
      });
    }
  }, [spotlightProduct]);

  // Check if product is in section
  const isInSection = (productId: string, sectionType: 'TRENDING' | 'SPOTLIGHT') => {
    if (sectionType === 'TRENDING') {
      return trendingProducts.some((sp) => {
        const spProductId = sp.product.slug || sp.product._id;
        return spProductId === productId || sp.product._id === productId;
      });
    } else {
      return spotlightProduct && (spotlightProduct.product.slug === productId || spotlightProduct.product._id === productId);
    }
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

  // Add selected products to trending section
  const handleAddTrending = async () => {
    if (selectedProducts.size === 0) {
      setSaveMessage({ type: 'error', text: 'Please select at least one product' });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const currentMaxOrder = trendingProducts.length > 0
        ? Math.max(...trendingProducts.map(tp => tp.order))
        : 0;

      const promises = Array.from(selectedProducts).map(async (productId, index) => {
        const product = allProducts.find(p => p.id === productId || p._id === productId);
        if (!product) return null;

        // Check if already exists
        const existing = trendingProducts.find(tp => {
          const tpProductId = tp.product.slug || tp.product._id;
          return tpProductId === productId || tp.product._id === productId;
        });

        if (existing) return null;

        const res = await fetch('/api/admin/section-products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product._id,
            sectionType: 'TRENDING',
            order: currentMaxOrder + index + 1,
          }),
        });

        if (!res.ok) throw new Error(`Failed to add product ${product.name}`);
        return res.json();
      });

      await Promise.all(promises);
      await loadSectionProducts();
      setSelectedProducts(new Set());
      setSaveMessage({ type: 'success', text: `Added ${selectedProducts.size} product(s) to trending` });
    } catch (error) {
      console.error('Failed to add products:', error);
      setSaveMessage({ type: 'error', text: 'Failed to add products. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Add single product to spotlight section
  const handleAddSpotlight = async () => {
    if (selectedProducts.size === 0) {
      setSaveMessage({ type: 'error', text: 'Please select a product' });
      return;
    }

    if (selectedProducts.size > 1) {
      setSaveMessage({ type: 'error', text: 'Product Spotlight can only have one product. Please select only one.' });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Remove existing spotlight product if any
      if (spotlightProduct) {
        await fetch(`/api/admin/section-products?id=${spotlightProduct._id}`, {
          method: 'DELETE',
        });
      }

      const productId = Array.from(selectedProducts)[0];
      const product = allProducts.find(p => p.id === productId || p._id === productId);
      if (!product) throw new Error('Product not found');

      const res = await fetch('/api/admin/section-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          sectionType: 'SPOTLIGHT',
          order: 1,
        }),
      });

      if (!res.ok) throw new Error(`Failed to add product ${product.name}`);

      await loadSectionProducts();
      setSelectedProducts(new Set());
      setSaveMessage({ type: 'success', text: 'Product added to spotlight successfully' });
    } catch (error) {
      console.error('Failed to add spotlight product:', error);
      setSaveMessage({ type: 'error', text: 'Failed to add product. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Remove product from section
  const handleRemove = async (itemId: string, sectionType: 'TRENDING' | 'SPOTLIGHT') => {
    if (!confirm(`Are you sure you want to remove this product from ${sectionType === 'TRENDING' ? 'trending' : 'spotlight'}?`)) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const res = await fetch(`/api/admin/section-products?id=${itemId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to remove product');

      await loadSectionProducts();
      setSaveMessage({ type: 'success', text: 'Product removed successfully' });
    } catch (error) {
      console.error('Failed to remove product:', error);
      setSaveMessage({ type: 'error', text: 'Failed to remove product' });
    } finally {
      setIsSaving(false);
    }
  };

  // Save spotlight data
  const handleSaveSpotlightData = async () => {
    if (!spotlightProduct) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const payload = {
        id: spotlightProduct._id,
        description: spotlightFormData.description || '',
        features: Array.isArray(spotlightFormData.features) ? spotlightFormData.features : [],
        hotspots: Array.isArray(spotlightFormData.hotspots) ? spotlightFormData.hotspots : [],
        buttonText: spotlightFormData.buttonText || 'Pre-order Now',
      };
      
      console.log('Saving spotlight data - Payload:', JSON.stringify(payload, null, 2));
      console.log('Features:', payload.features);
      console.log('Hotspots:', payload.hotspots);
      
      const res = await fetch('/api/admin/section-products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Save error response:', errorData);
        throw new Error(errorData.message || 'Failed to save spotlight data');
      }

      const savedData = await res.json();
      console.log('Saved spotlight data:', savedData);

      await loadSectionProducts();
      setIsEditingSpotlight(false);
      setSaveMessage({ type: 'success', text: 'Spotlight data saved successfully!' });
    } catch (error) {
      console.error('Failed to save spotlight data:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save spotlight data' });
    } finally {
      setIsSaving(false);
    }
  };

  // Add feature
  const handleAddFeature = () => {
    setSpotlightFormData({
      ...spotlightFormData,
      features: [...spotlightFormData.features, { icon: 'star', text: '' }],
    });
  };

  // Remove feature
  const handleRemoveFeature = (index: number) => {
    setSpotlightFormData({
      ...spotlightFormData,
      features: spotlightFormData.features.filter((_, i) => i !== index),
    });
  };

  // Add hotspot
  const handleAddHotspot = () => {
    setSpotlightFormData({
      ...spotlightFormData,
      hotspots: [
        ...spotlightFormData.hotspots,
        {
          position: { top: '25%', right: '25%' },
          title: '',
          description: '',
          color: '#22C55E',
        },
      ],
    });
  };

  // Remove hotspot
  const handleRemoveHotspot = (index: number) => {
    setSpotlightFormData({
      ...spotlightFormData,
      hotspots: spotlightFormData.hotspots.filter((_, i) => i !== index),
    });
  };

  // Reorder trending products
  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const sorted = [...trendingProducts].sort((a, b) => a.order - b.order);

    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sorted.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...sorted];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];

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

      await loadSectionProducts();
      setSaveMessage({ type: 'success', text: 'Products reordered successfully' });
    } catch (error) {
      console.error('Failed to reorder products:', error);
      setSaveMessage({ type: 'error', text: 'Failed to reorder products' });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = allProducts.filter(
    (product) =>
      !isInSection(product.id, selectedSection) &&
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.category || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
          <p className="text-gray-600">Loading section products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Section Products Management</h1>
          <p className="text-gray-600 mt-1">Manage products displayed in homepage sections</p>
        </div>
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

      {/* Section Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex gap-4">
          <button
            onClick={() => {
              setSelectedSection('TRENDING');
              setSelectedProducts(new Set());
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedSection === 'TRENDING'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="material-symbols-outlined align-middle mr-2">trending_up</span>
            Trending Products
          </button>
          <button
            onClick={() => {
              setSelectedSection('SPOTLIGHT');
              setSelectedProducts(new Set());
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedSection === 'SPOTLIGHT'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="material-symbols-outlined align-middle mr-2">light_mode</span>
            Product Spotlight
          </button>
        </div>
      </div>

      {/* Current Section Products */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">
            {selectedSection === 'TRENDING' ? 'Trending Products' : 'Product Spotlight'} (
            {selectedSection === 'TRENDING' ? trendingProducts.length : (spotlightProduct ? 1 : 0)})
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {selectedSection === 'TRENDING'
              ? 'Products appear in this order on the homepage. Use arrows to reorder.'
              : 'Only one product can be featured in Product Spotlight.'}
          </p>
        </div>
        {selectedSection === 'TRENDING' ? (
          trendingProducts.length > 0 ? (
          <div className="p-6 space-y-4">
              {trendingProducts.map((tp, index) => (
              <div
                  key={tp._id}
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
                      disabled={index === trendingProducts.length - 1 || isSaving}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                  </button>
                </div>
                <div className="flex-shrink-0">
                  <img
                      src={tp.product.image || '/placeholder-product.png'}
                      alt={tp.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase font-bold">{tp.product.category || 'JioCoder'}</p>
                    <h3 className="font-semibold text-gray-900">{tp.product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                      ₹{tp.product.price.toLocaleString('en-IN')}
                  </p>
                </div>
                <button
                    onClick={() => handleRemove(tp._id, 'TRENDING')}
                    disabled={isSaving}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">trending_up</span>
              <p className="text-gray-500">No trending products selected yet</p>
              <p className="text-sm text-gray-400 mt-1">Select products from the list below and click "Add Selected" to add them</p>
            </div>
          )
        ) : (
          spotlightProduct ? (
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0">
                  <img
                    src={spotlightProduct.product.image || '/placeholder-product.png'}
                    alt={spotlightProduct.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase font-bold">{spotlightProduct.product.category || 'JioCoder'}</p>
                  <h3 className="font-semibold text-gray-900 text-lg">{spotlightProduct.product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    ₹{spotlightProduct.product.price.toLocaleString('en-IN')}
            </p>
          </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditingSpotlight(!isEditingSpotlight)}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50"
                  >
                    {isEditingSpotlight ? 'Cancel Edit' : 'Edit Content'}
                  </button>
                  <button
                    onClick={() => handleRemove(spotlightProduct._id, 'SPOTLIGHT')}
                    disabled={isSaving}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Spotlight Content Editor */}
              {isEditingSpotlight && (
                <div className="border border-gray-200 rounded-lg p-6 space-y-6 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900">Edit Spotlight Content</h3>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={spotlightFormData.description}
                      onChange={(e) => setSpotlightFormData({ ...spotlightFormData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter product description..."
                    />
                  </div>

                  {/* Features */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Features</label>
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Add Feature
                      </button>
                    </div>
                    <div className="space-y-2">
                      {spotlightFormData.features.map((feature, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <input
                            type="text"
                            value={feature.icon}
                            onChange={(e) => {
                              const updated = [...spotlightFormData.features];
                              updated[index].icon = e.target.value;
                              setSpotlightFormData({ ...spotlightFormData, features: updated });
                            }}
                            placeholder="Icon name (e.g., speed)"
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                          <input
                            type="text"
                            value={feature.text}
                            onChange={(e) => {
                              const updated = [...spotlightFormData.features];
                              updated[index].text = e.target.value;
                              setSpotlightFormData({ ...spotlightFormData, features: updated });
                            }}
                            placeholder="Feature text"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(index)}
                            className="text-red-600 hover:text-red-700 p-2"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hotspots */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Hotspots</label>
                      <button
                        type="button"
                        onClick={handleAddHotspot}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Add Hotspot
                      </button>
                    </div>
                    <div className="space-y-4">
                      {spotlightFormData.hotspots.map((hotspot, index) => (
                        <div key={index} className="border border-gray-300 rounded-lg p-4 bg-white">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">Hotspot {index + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveHotspot(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <input
                              type="text"
                              value={hotspot.position.top || ''}
                              onChange={(e) => {
                                const updated = [...spotlightFormData.hotspots];
                                updated[index].position.top = e.target.value;
                                setSpotlightFormData({ ...spotlightFormData, hotspots: updated });
                              }}
                              placeholder="Top (e.g., 25%)"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <input
                              type="text"
                              value={hotspot.position.bottom || ''}
                              onChange={(e) => {
                                const updated = [...spotlightFormData.hotspots];
                                updated[index].position.bottom = e.target.value;
                                setSpotlightFormData({ ...spotlightFormData, hotspots: updated });
                              }}
                              placeholder="Bottom (e.g., 33%)"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <input
                              type="text"
                              value={hotspot.position.left || ''}
                              onChange={(e) => {
                                const updated = [...spotlightFormData.hotspots];
                                updated[index].position.left = e.target.value;
                                setSpotlightFormData({ ...spotlightFormData, hotspots: updated });
                              }}
                              placeholder="Left (e.g., 33%)"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <input
                              type="text"
                              value={hotspot.position.right || ''}
                              onChange={(e) => {
                                const updated = [...spotlightFormData.hotspots];
                                updated[index].position.right = e.target.value;
                                setSpotlightFormData({ ...spotlightFormData, hotspots: updated });
                              }}
                              placeholder="Right (e.g., 25%)"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                          <input
                            type="text"
                            value={hotspot.title}
                            onChange={(e) => {
                              const updated = [...spotlightFormData.hotspots];
                              updated[index].title = e.target.value;
                              setSpotlightFormData({ ...spotlightFormData, hotspots: updated });
                            }}
                            placeholder="Hotspot title"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm mb-2"
                          />
                          <textarea
                            value={hotspot.description}
                            onChange={(e) => {
                              const updated = [...spotlightFormData.hotspots];
                              updated[index].description = e.target.value;
                              setSpotlightFormData({ ...spotlightFormData, hotspots: updated });
                            }}
                            placeholder="Hotspot description"
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm mb-2"
                          />
                          <input
                            type="text"
                            value={hotspot.color}
                            onChange={(e) => {
                              const updated = [...spotlightFormData.hotspots];
                              updated[index].color = e.target.value;
                              setSpotlightFormData({ ...spotlightFormData, hotspots: updated });
                            }}
                            placeholder="Color (e.g., #22C55E or #3b82f6)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Button Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                    <input
                      type="text"
                      value={spotlightFormData.buttonText}
                      onChange={(e) => setSpotlightFormData({ ...spotlightFormData, buttonText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Button text"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setIsEditingSpotlight(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveSpotlightData}
                      disabled={isSaving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">light_mode</span>
              <p className="text-gray-500">No spotlight product selected yet</p>
              <p className="text-sm text-gray-400 mt-1">Select one product from the list below and click "Add Selected" to add it</p>
            </div>
          )
        )}
      </div>

      {/* Available Products */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Select Products</h2>
            {selectedProducts.size > 0 && (
              <button
                onClick={selectedSection === 'TRENDING' ? handleAddTrending : handleAddSpotlight}
                disabled={isSaving}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {selectedSection === 'TRENDING' ? 'Adding...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">add</span>
                    Add Selected ({selectedProducts.size})
                    {selectedSection === 'SPOTLIGHT' && selectedProducts.size > 1 && (
                      <span className="text-xs ml-2">(Only 1 allowed)</span>
                    )}
                  </>
                )}
              </button>
            )}
          </div>
          {selectedSection === 'SPOTLIGHT' && (
            <p className="text-sm text-yellow-600 mb-3 bg-yellow-50 p-2 rounded">
              ⚠️ Product Spotlight can only display one product. If you select multiple, only the first will be added.
            </p>
          )}
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
                onClick={() => {
                  if (selectedSection === 'SPOTLIGHT' && selectedProducts.size >= 1 && !selectedProducts.has(product.id)) {
                    setSaveMessage({ type: 'error', text: 'Product Spotlight can only have one product. Please deselect the current selection first.' });
                    return;
                  }
                  handleToggleSelection(product.id);
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedProducts.has(product.id)}
                  onChange={() => {
                    if (selectedSection === 'SPOTLIGHT' && selectedProducts.size >= 1 && !selectedProducts.has(product.id)) {
                      setSaveMessage({ type: 'error', text: 'Product Spotlight can only have one product. Please deselect the current selection first.' });
                      return;
                    }
                    handleToggleSelection(product.id);
                  }}
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
              {searchQuery ? 'No products found' : 'All products are already in this section'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
