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
    // Fetch products from admin products page (in real app, this would be an API call)
    // For now, we'll use mock data that matches the products structure
    const products: Product[] = [
      {
        id: 'keyboard-1',
        name: 'Keychron K2 Keyboard',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYYaK_kJQeDLBQe_vIhIfpvQFrKWDFMzT5uCj-WYv4_Yrg8fBz0tLw3B9Di8OGJpUq6MS2iK7p15s5cKdz59YvQTQOjXTWOvBvyGTlzbKzJDwOAxraZuylCZ8xUVYoya5pU74k7JRqXqhvZ6r5ByCp17LNHrQHqlKOWtSEVRu-oZViU2TpmAJIJCSgq7dgdOEZzSbDpZZgpzybypXPIFAnmRFPQ9V99esFHJeUFY0OObx28cOWcU-chPhuaZDKDNKacxKTB2qZ9-Yb',
        price: 7499,
        originalPrice: 9999,
        rating: 4.5,
        reviewCount: 2400,
        brand: 'Keychron',
        inStock: true,
      },
      {
        id: 'keyboard-2',
        name: 'Logitech MX Keys',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKsZQW7Nj6vNUklr5dWHdz5iJfptn4bvN3VhJPHWL1GnAZdGLW2rMKcvVd_zFLEQRH4GecddjmBOdn-uxam63prKZmXViUF8xIrjO4F_U7oF3v0iO4iNjAGitEpAob0PBeXyLAfe-OgJPEqkmZozUCVI_mW3rRUM_GAo2nF3n2KG5cwLvmyw7i8SDeuy40etjJKeTlen72g1t_UPzgke_zzEko3eJzGjgjKQIPGdpUMvGPJkt2KqveOeWJdOwrNtjDhnxlN52BXpUh',
        price: 12995,
        rating: 5,
        reviewCount: 5800,
        brand: 'Logitech',
        inStock: true,
      },
    ];
    setAllProducts(products);

    // Mock collections data
    setCollections([
      {
        id: 'col-1',
        name: 'Mechanical Keyboards',
        description: 'Premium mechanical keyboards collection',
        slug: 'mechanical-keyboards',
        productIds: ['keyboard-1', 'keyboard-2'],
        createdAt: '2024-01-01',
        featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYYaK_kJQeDLBQe_vIhIfpvQFrKWDFMzT5uCj-WYv4_Yrg8fBz0tLw3B9Di8OGJpUq6MS2iK7p15s5cKdz59YvQTQOjXTWOvBvyGTlzbKzJDwOAxraZuylCZ8xUVYoya5pU74k7JRqXqhvZ6r5ByCp17LNHrQHqlKOWtSEVRu-oZViU2TpmAJIJCSgq7dgdOEZzSbDpZZgpzybypXPIFAnmRFPQ9V99esFHJeUFY0OObx28cOWcU-chPhuaZDKDNKacxKTB2qZ9-Yb',
      },
      {
        id: 'col-2',
        name: 'Gaming Mice',
        description: 'High-performance gaming mice',
        slug: 'gaming-mice',
        productIds: [],
        createdAt: '2024-01-02',
      },
    ]);
  }, []);

  const handleCreateCollection = () => {
    const slug = collectionForm.slug || collectionForm.name.toLowerCase().replace(/\s+/g, '-');
    const newCollection: Collection = {
      id: `col-${Date.now()}`,
      name: collectionForm.name,
      description: collectionForm.description,
      slug: slug,
      productIds: [],
      createdAt: new Date().toISOString(),
      metadata: collectionForm.metadata,
    };
    setCollections([...collections, newCollection]);
    
    // Save to localStorage
    const savedCollections = JSON.parse(localStorage.getItem('adminCollections') || '[]');
    localStorage.setItem('adminCollections', JSON.stringify([...savedCollections, newCollection]));
    
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
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const collectionProducts = selectedCollection
    ? allProducts.filter((p) => selectedCollection.productIds.includes(p.id))
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
                  onClick={() => setSelectedCollection(collection)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{collection.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{collection.description}</div>
                  <div className="text-xs text-gray-400 mt-2">
                    {collection.productIds.length} products
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Are you sure you want to delete "${collection.name}"?`)) {
                      setCollections(collections.filter((c) => c.id !== collection.id));
                      if (selectedCollection?.id === collection.id) {
                        setSelectedCollection(null);
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
                  <button
                    onClick={() => setSelectedCollection(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                {/* Search and Filter */}
                <div className="mb-4 space-y-3">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      search
                    </span>
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
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
                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {filteredProducts
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
                      })}
                  </div>
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

