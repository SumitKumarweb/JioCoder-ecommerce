'use client';

import { useState, useEffect } from 'react';

interface PageMetadata {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
}

const defaultMetadata: PageMetadata = {
  metaTitle: 'About Us - JioCoder',
  metaDescription:
    "Learn about JioCoder - India's premier destination for high-end electronics. Our journey from startup vision to India's tech hub, serving 500k+ customers with genuine gear and 24/7 support.",
  metaKeywords: 'about jiocoder, tech company india, electronics retailer, about us',
  ogTitle: 'About Us - JioCoder',
  ogDescription:
    "Learn about JioCoder - India's premier destination for high-end electronics. Our journey from startup vision to India's tech hub.",
  ogImage: '',
  canonicalUrl: '/about',
};

export default function PageMetadataPage() {
  const [metadata, setMetadata] = useState<PageMetadata>(defaultMetadata);
  const [savedPages, setSavedPages] = useState<{ [key: string]: PageMetadata }>({});
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load saved metadata from localStorage
    const saved = localStorage.getItem('pageMetadata');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedPages(parsed);
      if (parsed[selectedPage]) {
        setMetadata(parsed[selectedPage]);
      } else {
        setMetadata(defaultMetadata);
      }
    }
  }, []);

  useEffect(() => {
    // Update metadata when page selection changes
    if (savedPages[selectedPage]) {
      setMetadata(savedPages[selectedPage]);
    } else {
      // Set default based on selected page
      const defaults: { [key: string]: PageMetadata } = {
        home: {
          metaTitle: 'JioCoder - Premium Mechanical Keyboards & Gaming Peripherals',
          metaDescription: 'Discover premium mechanical keyboards, gaming mice, keycaps, and custom cables at JioCoder. Shop trending products, best sellers, and authentic gear with fast India-wide shipping.',
          metaKeywords: 'mechanical keyboards, gaming mice, keycaps, custom cables, gaming peripherals, India keyboard store',
          ogTitle: 'JioCoder - Premium Mechanical Keyboards & Gaming Peripherals',
          ogDescription: 'Discover premium mechanical keyboards, gaming mice, keycaps, and custom cables. Fast India-wide shipping and authentic products.',
          ogImage: '',
          canonicalUrl: '/',
        },
        about: defaultMetadata,
        products: {
          metaTitle: 'Products - JioCoder',
          metaDescription: 'Browse our collection of premium mechanical keyboards, gaming mice, and accessories.',
          metaKeywords: 'products, keyboards, gaming mice, accessories',
          ogTitle: 'Products - JioCoder',
          ogDescription: 'Browse our collection of premium mechanical keyboards, gaming mice, and accessories.',
          ogImage: '',
          canonicalUrl: '/products',
        },
        collections: {
          metaTitle: 'Collections - JioCoder',
          metaDescription: 'Explore our curated collections of premium tech products.',
          metaKeywords: 'collections, tech products, curated',
          ogTitle: 'Collections - JioCoder',
          ogDescription: 'Explore our curated collections of premium tech products.',
          ogImage: '',
          canonicalUrl: '/collections',
        },
      };
      setMetadata(defaults[selectedPage] || defaultMetadata);
    }
  }, [selectedPage, savedPages]);

  const handleSave = () => {
    setSaving(true);
    const updated = { ...savedPages, [selectedPage]: metadata };
    setSavedPages(updated);
    localStorage.setItem('pageMetadata', JSON.stringify(updated));
    setTimeout(() => {
      setSaving(false);
      alert('Metadata saved successfully!');
    }, 500);
  };

  const pages = [
    { id: 'home', label: 'Homepage', icon: 'home' },
    { id: 'about', label: 'About Us', icon: 'info' },
    { id: 'products', label: 'Products Page', icon: 'inventory_2' },
    { id: 'collections', label: 'Collections Page', icon: 'collections' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Page Metadata Management</h1>
        <p className="text-gray-600 mt-1">Manage SEO metadata for different pages</p>
      </div>

      {/* Page Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">Select Page</label>
        <div className="flex gap-3">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setSelectedPage(page.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                selectedPage === page.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{page.icon}</span>
              <span>{page.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Metadata Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          SEO Metadata for {pages.find((p) => p.id === selectedPage)?.label}
        </h2>

        <div className="space-y-6">
          {/* Basic SEO */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">search</span>
              Basic SEO
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title *
                </label>
                <input
                  type="text"
                  value={metadata.metaTitle}
                  onChange={(e) => setMetadata({ ...metadata, metaTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Page title for search engines"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 50-60 characters ({metadata.metaTitle.length} characters)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description *
                </label>
                <textarea
                  value={metadata.metaDescription}
                  onChange={(e) => setMetadata({ ...metadata, metaDescription: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description for search engines"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 150-160 characters ({metadata.metaDescription.length} characters)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={metadata.metaKeywords}
                  onChange={(e) => setMetadata({ ...metadata, metaKeywords: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Comma-separated keywords relevant to this page
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Canonical URL
                </label>
                <input
                  type="text"
                  value={metadata.canonicalUrl}
                  onChange={(e) => setMetadata({ ...metadata, canonicalUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="/about"
                />
              </div>
            </div>
          </div>

          {/* Open Graph */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">share</span>
              Open Graph (Social Media)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Title</label>
                <input
                  type="text"
                  value={metadata.ogTitle}
                  onChange={(e) => setMetadata({ ...metadata, ogTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Title for social media shares"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OG Description
                </label>
                <textarea
                  value={metadata.ogDescription}
                  onChange={(e) => setMetadata({ ...metadata, ogDescription: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Description for social media shares"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
                <input
                  type="text"
                  value={metadata.ogImage}
                  onChange={(e) => setMetadata({ ...metadata, ogImage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 1200x630px image for best social media display
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">save</span>
                Save Metadata
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

