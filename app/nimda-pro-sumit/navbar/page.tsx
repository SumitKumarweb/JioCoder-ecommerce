'use client';

import { useEffect, useState } from 'react';

type AdminNavItem = {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
};

const DEFAULT_ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { id: 'blog', label: 'Blog', href: '/blog', enabled: true },
  { id: 'deals', label: 'Deals', href: '/sale', enabled: true },
];

export default function AdminNavbarPage() {
  const [items, setItems] = useState<AdminNavItem[]>(DEFAULT_ADMIN_NAV_ITEMS);
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Load configuration from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = window.localStorage.getItem('adminNavbarItems');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      } else {
        // Initialize storage with defaults if nothing there
        window.localStorage.setItem('adminNavbarItems', JSON.stringify(DEFAULT_ADMIN_NAV_ITEMS));
      }
    } catch (error) {
      console.error('Failed to load admin navbar items from localStorage', error);
    } finally {
      setLoadedFromStorage(true);
    }
  }, []);

  const handleAddItem = () => {
    const newItem: AdminNavItem = {
      id: `item-${Date.now()}`,
      label: 'New Link',
      href: '/',
      enabled: true,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleChangeItem = (id: string, field: keyof AdminNavItem, value: string | boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    if (typeof window === 'undefined') return;

    setSaving(true);
    setMessage(null);

    try {
      window.localStorage.setItem('adminNavbarItems', JSON.stringify(items));
      setMessage('Navbar configuration saved successfully.');
    } catch (error) {
      console.error('Failed to save admin navbar items to localStorage', error);
      setMessage('Failed to save configuration. Please try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (!loadedFromStorage) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Loading navbar settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Header / Navbar Links</h1>
        <button
          type="button"
          onClick={handleAddItem}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Add Link
        </button>
      </div>

      <p className="text-sm text-gray-600">
        Manage the extra links that appear in the main website header (for example: Blog, Deals). You can change their
        label, URL, enable/disable them, or remove them.
      </p>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        {items.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">No navbar links configured. Click &quot;Add Link&quot; to create one.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Label</label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleChangeItem(item.id, 'label', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">URL (href)</label>
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => handleChangeItem(item.id, 'href', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="/blog or /sale"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={(e) => handleChangeItem(item.id, 'enabled', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Enabled</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}


