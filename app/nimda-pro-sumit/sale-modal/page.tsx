'use client';

import { useEffect, useState } from 'react';

interface SaleModalConfig {
  enabled: boolean;
  showEveryNthVisit: number;
  leftImageUrl?: string;
  leftImageAlt?: string;
  leftBadgeText?: string;
  leftHeading?: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  description: string;
  emailLabel: string;
  emailPlaceholder: string;
  submitButtonText: string;
  dismissText: string;
  bottomIcons: string[];
}

const defaultConfig: SaleModalConfig = {
  enabled: true,
  showEveryNthVisit: 6,
  leftImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjDoyekeODajybVX9n2INQcvMNl7ULZ2BxnXpixKg_epck_GX3EysJ3DsVYofMcg0EMNJjTaeKzizjRGWseCoLfQh6DKMjBdXs6uPOsVqXK-5us8lGMM2d1sJig4fA-B0RxWROZo-JdSLkKX0-f17KfhNCLXJOb1W9lI6w_z-_OkkGPu6m_ggi4lAgcWZrNyNIBHLug4AkHEKYEr2FOLzvlCQEIGeyLmdoFRQh6Fo8awef4_0Dfo_FOVugCq-tdiqiDetE6-ySGntl',
  leftImageAlt: 'Premium RGB Gaming Mouse Pad',
  leftBadgeText: 'Limited Time Offer',
  leftHeading: 'Enhance Your Setup',
  titlePrefix: 'GET',
  titleHighlight: '20% OFF',
  titleSuffix: 'YOUR FIRST ORDER!',
  description: 'Join the JioCoder community. Sign up for our newsletter to unlock your exclusive discount code and stay updated on the latest tech drops.',
  emailLabel: 'Email Address',
  emailPlaceholder: 'e.g. arjun@example.com',
  submitButtonText: 'Claim My Discount',
  dismissText: "No thanks, I'll pay full price",
  bottomIcons: ['verified_user', 'local_shipping', 'payments'],
};

export default function SaleModalAdminPage() {
  const [config, setConfig] = useState<SaleModalConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch('/api/admin/sale-modal');
        if (!res.ok) {
          throw new Error(`Failed to fetch config: ${res.status}`);
        }
        const data = await res.json();
        if (data && Object.keys(data).length > 0) {
          setConfig({
            enabled: data.enabled !== false,
            showEveryNthVisit: data.showEveryNthVisit || 6,
            leftImageUrl: data.leftImageUrl || '',
            leftImageAlt: data.leftImageAlt || '',
            leftBadgeText: data.leftBadgeText || '',
            leftHeading: data.leftHeading || '',
            titlePrefix: data.titlePrefix || '',
            titleHighlight: data.titleHighlight || '',
            titleSuffix: data.titleSuffix || '',
            description: data.description || '',
            emailLabel: data.emailLabel || '',
            emailPlaceholder: data.emailPlaceholder || '',
            submitButtonText: data.submitButtonText || '',
            dismissText: data.dismissText || '',
            bottomIcons: Array.isArray(data.bottomIcons) ? data.bottomIcons : defaultConfig.bottomIcons,
          });
        }
      } catch (error) {
        console.error('Failed to load sale modal config from API', error);
        setMessage('Failed to load config. Using defaults.');
        setTimeout(() => setMessage(null), 3000);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const handleChange = <K extends keyof SaleModalConfig>(
    field: K,
    value: SaleModalConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/sale-modal', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!res.ok) {
        throw new Error(`Failed to save: ${res.status}`);
      }

      const saved = await res.json();
      setConfig({
        enabled: saved.enabled !== false,
        showEveryNthVisit: saved.showEveryNthVisit || 6,
        leftImageUrl: saved.leftImageUrl || '',
        leftImageAlt: saved.leftImageAlt || '',
        leftBadgeText: saved.leftBadgeText || '',
        leftHeading: saved.leftHeading || '',
        titlePrefix: saved.titlePrefix || '',
        titleHighlight: saved.titleHighlight || '',
        titleSuffix: saved.titleSuffix || '',
        description: saved.description || '',
        emailLabel: saved.emailLabel || '',
        emailPlaceholder: saved.emailPlaceholder || '',
        submitButtonText: saved.submitButtonText || '',
        dismissText: saved.dismissText || '',
        bottomIcons: Array.isArray(saved.bottomIcons) ? saved.bottomIcons : defaultConfig.bottomIcons,
      });
      setMessage('Sale modal configuration saved successfully.');
    } catch (error) {
      console.error('Failed to save sale modal config to MongoDB', error);
      setMessage('Failed to save. Please try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Loading sale modal settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Sale Modal Configuration</h1>
        <a
          href="/sale-modal"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-600 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
        >
          <span className="material-symbols-outlined mr-2">open_in_new</span>
          Preview Modal
        </a>
      </div>

      <p className="text-sm text-gray-600">
        Manage the content and behavior of the sale modal that appears to visitors. Configure the{' '}
        <strong>display frequency</strong>, <strong>visual elements</strong>, <strong>text content</strong>, and{' '}
        <strong>form labels</strong>.
      </p>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6">
        {/* General Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            General Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => handleChange('enabled', e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Enable Sale Modal</span>
            </label>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">
                Show Every Nth Visit *
              </label>
              <input
                type="number"
                min="1"
                value={config.showEveryNthVisit}
                onChange={(e) => handleChange('showEveryNthVisit', parseInt(e.target.value) || 6)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-[11px] text-gray-500">
                Modal appears every N visits (e.g., 6 = every 6th visit)
              </p>
            </div>
          </div>
        </div>

        {/* Left Visual Pane */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Left Visual Pane
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">Image URL</label>
              <input
                type="text"
                value={config.leftImageUrl || ''}
                onChange={(e) => handleChange('leftImageUrl', e.target.value)}
                placeholder="https://..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">Image Alt Text</label>
              <input
                type="text"
                value={config.leftImageAlt || ''}
                onChange={(e) => handleChange('leftImageAlt', e.target.value)}
                placeholder="Descriptive alt text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">Badge Text</label>
              <input
                type="text"
                value={config.leftBadgeText || ''}
                onChange={(e) => handleChange('leftBadgeText', e.target.value)}
                placeholder="e.g. Limited Time Offer"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">Heading</label>
              <input
                type="text"
                value={config.leftHeading || ''}
                onChange={(e) => handleChange('leftHeading', e.target.value)}
                placeholder="e.g. Enhance Your Setup"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Right Content Pane */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Right Content Pane
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">Title Prefix *</label>
              <input
                type="text"
                value={config.titlePrefix}
                onChange={(e) => handleChange('titlePrefix', e.target.value)}
                placeholder="e.g. GET"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">Title Highlight *</label>
              <input
                type="text"
                value={config.titleHighlight}
                onChange={(e) => handleChange('titleHighlight', e.target.value)}
                placeholder="e.g. 20% OFF"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">Title Suffix *</label>
              <input
                type="text"
                value={config.titleSuffix}
                onChange={(e) => handleChange('titleSuffix', e.target.value)}
                placeholder="e.g. YOUR FIRST ORDER!"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-700">Description *</label>
            <textarea
              value={config.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              placeholder="Main description text"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">Email Label *</label>
              <input
                type="text"
                value={config.emailLabel}
                onChange={(e) => handleChange('emailLabel', e.target.value)}
                placeholder="e.g. Email Address"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">Email Placeholder *</label>
              <input
                type="text"
                value={config.emailPlaceholder}
                onChange={(e) => handleChange('emailPlaceholder', e.target.value)}
                placeholder="e.g. e.g. arjun@example.com"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">Submit Button Text *</label>
              <input
                type="text"
                value={config.submitButtonText}
                onChange={(e) => handleChange('submitButtonText', e.target.value)}
                placeholder="e.g. Claim My Discount"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">Dismiss Text *</label>
              <input
                type="text"
                value={config.dismissText}
                onChange={(e) => handleChange('dismissText', e.target.value)}
                placeholder="e.g. No thanks, I'll pay full price"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-700">Bottom Icons (Material Symbols)</label>
            <input
              type="text"
              value={config.bottomIcons.join(', ')}
              onChange={(e) => {
                const icons = e.target.value.split(',').map((icon) => icon.trim()).filter(Boolean);
                handleChange('bottomIcons', icons);
              }}
              placeholder="verified_user, local_shipping, payments"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-[11px] text-gray-500">
              Comma-separated list of Material Symbols icon names
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
        {message && (
          <p className={`text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

