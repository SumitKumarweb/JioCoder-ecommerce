'use client';

import { useState, useEffect } from 'react';

interface Collection {
  _id: string;
  name: string;
  slug: string;
  heroImage?: string;
  description?: string;
}

interface FeaturedCategory {
  _id: string;
  collectionId: string;
  order: number;
  collection?: Collection;
}

export default function FeaturedCategoriesPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [featuredCategories, setFeaturedCategories] = useState<FeaturedCategory[]>([]);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);
  const [viewAllUrl, setViewAllUrl] = useState('/products');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Load collections and featured categories
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch all collections
        const collectionsRes = await fetch('/api/collections');
        if (collectionsRes.ok) {
          const collectionsData = await collectionsRes.json();
          setCollections(collectionsData || []);
        }

        // Fetch featured categories
        const featuredRes = await fetch('/api/admin/featured-categories');
        if (featuredRes.ok) {
          const featuredData = await featuredRes.json();
          const fetchedCategories = featuredData.categories || [];
          
          // Sort by order to maintain correct sequence
          const sortedCategories = fetchedCategories.sort((a: FeaturedCategory, b: FeaturedCategory) => 
            (a.order || 0) - (b.order || 0)
          );
          
          setFeaturedCategories(sortedCategories);
          // Preserve order when setting selected collection IDs
          setSelectedCollectionIds(sortedCategories.map((fc: FeaturedCategory) => String(fc.collectionId)));
          if (featuredData.viewAllUrl) {
            setViewAllUrl(featuredData.viewAllUrl);
          }
        }
      } catch (error) {
        console.error('Failed to load data', error);
        setMessage('Failed to load data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleToggleCollection = (collectionId: string) => {
    setSelectedCollectionIds((prev) => {
      const normalizedId = String(collectionId);
      const normalizedPrev = prev.map(id => String(id));
      
      if (normalizedPrev.includes(normalizedId)) {
        return normalizedPrev.filter((id) => id !== normalizedId);
      } else {
        return [...normalizedPrev, normalizedId];
      }
    });
  };

  const handleReorder = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...selectedCollectionIds];
    if (direction === 'up' && index > 0) {
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setSelectedCollectionIds(newOrder);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/featured-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectionIds: selectedCollectionIds,
          viewAllUrl,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to save featured categories: ${res.status}`);
      }

      const data = await res.json();
      setFeaturedCategories(data.categories || []);
      setMessage('Featured categories saved successfully!');
    } catch (error: any) {
      console.error('Failed to save featured categories', error);
      setMessage(error.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const getFeaturedCategoryDetails = (collectionId: string) => {
    return collections.find((col) => col._id === collectionId);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Featured Categories</h1>
          <p className="text-gray-600 mt-1">Select collections to display as featured categories on homepage</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      {/* View All URL Setting */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">View All URL</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={viewAllUrl}
            onChange={(e) => setViewAllUrl(e.target.value)}
            placeholder="/products"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          This URL will be used for the "View All" link in the Featured Categories section. Save changes above to update.
        </p>
      </div>

      {/* Available Collections */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">
            Available Collections ({collections.length})
          </h2>
          <p className="text-sm text-gray-500 mt-1">Select collections to feature on homepage</p>
        </div>
        {collections.length > 0 ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map((collection) => {
                const normalizedCollectionId = String(collection._id);
                const isSelected = selectedCollectionIds.map(id => String(id)).includes(normalizedCollectionId);
                return (
                  <div
                    key={collection._id}
                    onClick={() => handleToggleCollection(collection._id)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleCollection(normalizedCollectionId)}
                        className="mt-1 h-4 w-4 text-blue-600 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {collection.heroImage && (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={collection.heroImage}
                                alt={collection.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <h3 className="font-semibold text-gray-900">{collection.name}</h3>
                        </div>
                        {collection.description && (
                          <p className="text-xs text-gray-500 line-clamp-2">{collection.description}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">/collections/{collection.slug}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
              collections
            </span>
            <p className="text-gray-500">No collections available. Create collections first.</p>
          </div>
        )}
      </div>

      {/* Selected Featured Categories */}
      {selectedCollectionIds.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">
              Featured Categories Order ({selectedCollectionIds.length})
            </h2>
            <p className="text-sm text-gray-500 mt-1">Drag or use arrows to reorder</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {selectedCollectionIds.map((collectionId, index) => {
                const collection = getFeaturedCategoryDetails(collectionId);
                if (!collection) return null;

                return (
                  <div
                    key={collectionId}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      {collection.heroImage ? (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={collection.heroImage}
                            alt={collection.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined text-gray-400">collections</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{collection.name}</h3>
                      <p className="text-xs text-gray-500">/collections/{collection.slug}</p>
                    </div>
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
                        disabled={index === selectedCollectionIds.length - 1}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                      </button>
                    </div>
                    <button
                      onClick={() => handleToggleCollection(String(collectionId))}
                      className="text-red-600 hover:text-red-700"
                      title="Remove"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

