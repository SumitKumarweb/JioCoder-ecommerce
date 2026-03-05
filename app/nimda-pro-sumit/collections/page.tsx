'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/components/ProductGrid';

interface CollectionMetadata {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  slug: string;
  productIds: string[];
  createdAt: string;
  featuredImage?: string;
  metadata?: CollectionMetadata;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [originalProductIds, setOriginalProductIds] = useState<string[]>([]);
  const [collectionForm, setCollectionForm] = useState({
    name: '',
    description: '',
    slug: '',
    metadata: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      canonicalUrl: '',
    } as CollectionMetadata,
  });

  useEffect(() => {
    // Fetch all products from API
    const loadProducts = async () => {
      setProductsLoading(true);
      try {
        const res = await fetch('/api/admin/products');
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status}`);
        }
        const data = await res.json();
        // Map MongoDB product data to Product interface
        const mappedProducts: Product[] = data.map((product: any) => ({
          id: String(product._id || product.id), // Ensure ID is always a string
          name: product.name,
          image: product.image || '',
          price: product.price || 0,
          originalPrice: product.originalPrice,
          rating: product.rating || 0,
          reviewCount: product.reviewCount || 0,
          brand: product.brand || product.category || 'Unknown',
          inStock: product.inStock !== false,
          badge: product.badge,
          discount: product.discount,
        }));
        setAllProducts(mappedProducts);
      } catch (error) {
        console.error('Failed to load products from API', error);
        setAllProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };
    loadProducts();

    // Fetch collections from MongoDB
    const loadCollections = async () => {
      try {
        const res = await fetch('/api/admin/collections');
        if (!res.ok) {
          throw new Error(`Failed to fetch collections: ${res.status}`);
        }
        const data = await res.json();
        // Map MongoDB data to Collection interface
        const mappedCollections: Collection[] = data.map((col: any) => ({
          id: String(col._id || col.id), // Ensure ID is always a string
          name: col.name,
          description: col.description || '',
          slug: col.slug,
          productIds: (col.productIds || []).map((pid: any) => String(pid)), // Convert all productIds to strings
          createdAt: col.createdAt ? new Date(col.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          featuredImage: col.heroImage,
          metadata: col.metadata || {},
        }));
        setCollections(mappedCollections);
      } catch (error) {
        console.error('Failed to load collections from API', error);
        setCollections([]);
      }
    };
    loadCollections();
  }, []);

  // Helper function to reload collections
  const reloadCollections = async () => {
    try {
      const res = await fetch('/api/admin/collections');
      if (!res.ok) {
        throw new Error(`Failed to fetch collections: ${res.status}`);
      }
      const data = await res.json();
      const mappedCollections: Collection[] = data.map((col: any) => ({
        id: String(col._id || col.id), // Ensure ID is always a string
        name: col.name,
        description: col.description || '',
        slug: col.slug,
        productIds: (col.productIds || []).map((pid: any) => String(pid)), // Convert all productIds to strings
        createdAt: col.createdAt ? new Date(col.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        featuredImage: col.heroImage,
        metadata: col.metadata || {},
      }));
      setCollections(mappedCollections);
      
      // If a collection is currently selected, update it with the latest data from MongoDB
      if (selectedCollection) {
        const updatedCollection = mappedCollections.find((col) => col.id === selectedCollection.id);
        if (updatedCollection) {
          setSelectedCollection(updatedCollection);
          setOriginalProductIds(updatedCollection.productIds || []);
        }
      }
    } catch (error) {
      console.error('Failed to reload collections', error);
    }
  };

  // Save collection products to MongoDB
  const handleSaveCollectionProducts = async () => {
    if (!selectedCollection) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      const res = await fetch(`/api/admin/collections/${selectedCollection.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedCollection.name,
          slug: selectedCollection.slug,
          description: selectedCollection.description,
          heroImage: selectedCollection.featuredImage,
          isFeatured: false,
          productIds: selectedCollection.productIds,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to save: ${res.status}`);
      }

      // Get saved data from response
      const saved = await res.json();
      
      // Convert productIds to strings for consistency
      const savedProductIds = (saved.productIds || []).map((pid: any) => String(pid));
      
      // Update original productIds to match current state
      setOriginalProductIds(savedProductIds);
      
      // Update selected collection with saved data
      const updatedCollection: Collection = {
        ...selectedCollection,
        productIds: savedProductIds,
      };
      setSelectedCollection(updatedCollection);
      
      // Also update the collections list to reflect the saved productIds
      setCollections(
        collections.map((col) =>
          col.id === selectedCollection.id
            ? { ...col, productIds: savedProductIds }
            : col
        )
      );
      
      setSaveMessage('Products saved successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save collection products', error);
      setSaveMessage('Failed to save. Please try again.');
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = selectedCollection 
    ? JSON.stringify(selectedCollection.productIds.sort()) !== JSON.stringify(originalProductIds.sort())
    : false;

  const handleCreateCollection = async () => {
    try {
      const slug = collectionForm.slug || collectionForm.name.toLowerCase().replace(/\s+/g, '-');
      
      const res = await fetch('/api/admin/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: collectionForm.name,
          slug: slug,
          description: collectionForm.description,
          heroImage: collectionForm.metadata.ogImage || '',
          isFeatured: false,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to create collection: ${res.status}`);
      }

      await reloadCollections();
      
      setCollectionForm({ 
        name: '', 
        description: '', 
        slug: '',
        metadata: {
          metaTitle: '',
          metaDescription: '',
          metaKeywords: '',
          ogTitle: '',
          ogDescription: '',
          ogImage: '',
          canonicalUrl: '',
        },
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create collection', error);
      alert('Failed to create collection. Please try again.');
    }
  };

  const handleBulkAddProducts = () => {
    if (!selectedCollection || selectedProducts.length === 0) return;
    const newProductIds = [
      ...selectedCollection.productIds,
      ...selectedProducts.filter((id) => !selectedCollection.productIds.includes(id)),
    ];
    setCollections(
      collections.map((col) =>
        col.id === selectedCollection.id ? { ...col, productIds: newProductIds } : col
      )
    );
    setSelectedCollection({ ...selectedCollection, productIds: newProductIds });
    setSelectedProducts([]);
  };

  const handleBulkRemoveProducts = () => {
    if (!selectedCollection || selectedProducts.length === 0) return;
    const newProductIds = selectedCollection.productIds.filter(
      (id) => !selectedProducts.includes(id)
    );
    setCollections(
      collections.map((col) =>
        col.id === selectedCollection.id ? { ...col, productIds: newProductIds } : col
      )
    );
    setSelectedCollection({ ...selectedCollection, productIds: newProductIds });
    setSelectedProducts([]);
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const selectAllAvailable = () => {
    if (!selectedCollection) return;
    const availableIds = filteredProducts
      .filter((p) => !selectedCollection.productIds.includes(p.id))
      .map((p) => p.id);
    setSelectedProducts(availableIds);
  };

  const selectAllInCollection = () => {
    if (!selectedCollection) return;
    setSelectedProducts(selectedCollection.productIds);
  };

  const clearSelection = () => {
    setSelectedProducts([]);
  };

  const handleAddProductToCollection = (productId: string) => {
    if (!selectedCollection) return;
    setCollections(
      collections.map((col) =>
        col.id === selectedCollection.id
          ? { ...col, productIds: [...col.productIds, productId] }
          : col
      )
    );
    setSelectedCollection({
      ...selectedCollection,
      productIds: [...selectedCollection.productIds, productId],
    });
  };

  const handleRemoveProductFromCollection = (productId: string) => {
    if (!selectedCollection) return;
    setCollections(
      collections.map((col) =>
        col.id === selectedCollection.id
          ? { ...col, productIds: col.productIds.filter((id) => id !== productId) }
          : col
      )
    );
    setSelectedCollection({
      ...selectedCollection,
      productIds: selectedCollection.productIds.filter((id) => id !== productId),
    });
  };

  const filteredProducts = allProducts.filter((product) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query);
    return matchesSearch;
  });

  const collectionProducts = selectedCollection
    ? allProducts.filter((p) => {
        // Convert both IDs to strings for comparison to handle MongoDB ObjectId vs string mismatches
        const productId = String(p.id);
        const matches = selectedCollection.productIds.some((pid) => String(pid) === productId);
        return matches;
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collections Management</h1>
          <p className="text-gray-600 mt-1">Create and manage product collections</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
          Create Collection
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collections List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Collections</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className={`group relative ${
                  selectedCollection?.id === collection.id ? 'bg-blue-50' : ''
                }`}
              >
                <button
                  onClick={() => {
                    setSelectedCollection(collection);
                    setOriginalProductIds(collection.productIds || []);
                    setSelectedProducts([]);
                  }}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{collection.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{collection.description}</div>
                  <div className="text-xs text-gray-400 mt-2">
                    {collection.productIds.length} products
                  </div>
                </button>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (confirm(`Are you sure you want to delete "${collection.name}"?`)) {
                      try {
                        const res = await fetch(`/api/admin/collections/${collection.id}`, {
                          method: 'DELETE',
                        });
                        if (!res.ok) {
                          throw new Error(`Failed to delete collection: ${res.status}`);
                        }
                        await reloadCollections();
                        if (selectedCollection?.id === collection.id) {
                          setSelectedCollection(null);
                        }
                      } catch (error) {
                        console.error('Failed to delete collection', error);
                        alert('Failed to delete collection. Please try again.');
                      }
                    }
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 p-1 transition-opacity"
                  title="Delete collection"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Collection Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedCollection ? (
            <>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedCollection.name}</h2>
                    <p className="text-gray-600 mt-1">{selectedCollection.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {hasUnsavedChanges && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-orange-600 font-medium">Unsaved changes</span>
                        <button
                          onClick={handleSaveCollectionProducts}
                          disabled={saving}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">
                            {saving ? 'hourglass_empty' : 'save'}
                          </span>
                          {saving ? 'Saving...' : 'Save Products'}
                        </button>
                      </div>
                    )}
                    {saveMessage && (
                      <span className={`text-sm ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                        {saveMessage}
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setSelectedCollection(null);
                        setOriginalProductIds([]);
                        setSelectedProducts([]);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="mb-4 space-y-3">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      search
                    </span>
                    <input
                      type="text"
                      placeholder="Search products by name, brand, or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {searchQuery && (
                      <div className="mt-2 text-sm text-gray-600">
                        Found {filteredProducts.filter((p) => !selectedCollection?.productIds.includes(p.id)).length} products matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Products in Collection */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      Products in Collection ({collectionProducts.length})
                    </h3>
                    {collectionProducts.length > 0 && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={selectAllInCollection}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Select All
                        </button>
                        {selectedProducts.length > 0 && (
                          <>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={handleBulkRemoveProducts}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              Remove Selected ({selectedProducts.length})
                            </button>
                            <button
                              onClick={clearSelection}
                              className="text-sm text-gray-600 hover:text-gray-700"
                            >
                              Clear
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {collectionProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {collectionProducts.map((product) => {
                        const isSelected = selectedProducts.includes(product.id);
                        return (
                          <div
                            key={product.id}
                            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => toggleProductSelection(product.id)}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleProductSelection(product.id)}
                              className="rounded"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500">{product.brand}</div>
                              <div className="text-xs font-semibold text-gray-900 mt-1">
                                ₹{product.price.toLocaleString()}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveProductFromCollection(product.id);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <span className="material-symbols-outlined text-lg">remove_circle</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No products in this collection</p>
                  )}
                </div>

                {/* Available Products */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Add Products</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={selectAllAvailable}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Select All
                      </button>
                      {selectedProducts.length > 0 && (
                        <>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={handleBulkAddProducts}
                            className="text-sm text-green-600 hover:text-green-700"
                          >
                            Add Selected ({selectedProducts.length})
                          </button>
                          <button
                            onClick={clearSelection}
                            className="text-sm text-gray-600 hover:text-gray-700"
                          >
                            Clear
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {productsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                        <p className="text-gray-600 text-sm">Loading products...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {filteredProducts.filter((p) => !selectedCollection.productIds.includes(p.id)).length === 0 ? (
                        <div className="col-span-2 text-center py-8 text-gray-500">
                          {searchQuery ? (
                            <div>
                              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">search_off</span>
                              <p>No products found matching "{searchQuery}"</p>
                              <p className="text-sm mt-1">Try a different search term</p>
                            </div>
                          ) : (
                            <div>
                              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">inventory_2</span>
                              <p>No products available to add</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        filteredProducts
                          .filter((p) => !selectedCollection.productIds.includes(p.id))
                          .map((product) => {
                        const isSelected = selectedProducts.includes(product.id);
                        return (
                          <div
                            key={product.id}
                            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                            onClick={() => toggleProductSelection(product.id)}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleProductSelection(product.id)}
                              className="rounded"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500">{product.brand}</div>
                              <div className="text-xs font-semibold text-gray-900 mt-1">
                                ₹{product.price.toLocaleString()}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddProductToCollection(product.id);
                              }}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <span className="material-symbols-outlined text-lg">add_circle</span>
                            </button>
                          </div>
                        );
                      })
                      )}
                    </div>
                  )}
                </div>

                {/* Collection Preview Link */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Collection URL</p>
                      <p className="text-xs text-blue-700 mt-1">
                        /collections/{selectedCollection.slug}
                      </p>
                    </div>
                    <a
                      href={`/collections/${selectedCollection.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <span className="material-symbols-outlined text-base">open_in_new</span>
                      View Collection Page
                    </a>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
                collections
              </span>
              <p className="text-gray-500">Select a collection to manage products</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Collection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create New Collection</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Name *
                </label>
                <input
                  type="text"
                  value={collectionForm.name}
                  onChange={(e) =>
                    setCollectionForm({ ...collectionForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Mechanical Keyboards"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Slug (optional)
                </label>
                <input
                  type="text"
                  value={collectionForm.slug}
                  onChange={(e) =>
                    setCollectionForm({ ...collectionForm, slug: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="mechanical-keyboards (auto-generated if empty)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used in the collection URL: /collections/[slug]
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={collectionForm.description}
                  onChange={(e) =>
                    setCollectionForm({ ...collectionForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe this collection..."
                />
              </div>

              {/* SEO Metadata Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">seo</span>
                  SEO Metadata (Optional)
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={collectionForm.metadata.metaTitle}
                      onChange={(e) =>
                        setCollectionForm({
                          ...collectionForm,
                          metadata: { ...collectionForm.metadata, metaTitle: e.target.value },
                        })
                      }
                      placeholder="Collection title for search engines"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      value={collectionForm.metadata.metaDescription}
                      onChange={(e) =>
                        setCollectionForm({
                          ...collectionForm,
                          metadata: { ...collectionForm.metadata, metaDescription: e.target.value },
                        })
                      }
                      placeholder="Brief description for search engines"
                      rows={2}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      value={collectionForm.metadata.metaKeywords}
                      onChange={(e) =>
                        setCollectionForm({
                          ...collectionForm,
                          metadata: { ...collectionForm.metadata, metaKeywords: e.target.value },
                        })
                      }
                      placeholder="keyword1, keyword2"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCollection}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

