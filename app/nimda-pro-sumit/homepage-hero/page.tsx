'use client';

import { useEffect, useState } from 'react';
import type { HeroSlide } from '@/components/Hero';

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC2szADM5ISIXlgO-jmeh_WgCinJ9UftMKB7j6hbRvTZD5ugGjePtpr6m6DVHlXAPcWT6auCrnysq7_CpQwCJnpNpXlF2CwFWG46ax5ECUikI41JhnjQiN_2MxhxVr4VP_vnIIKjaaWwjTH7fUC2MvhBjuJL2RWLMZXlW9j-wgVELmIfI4q2tkSXebnBWq05UTZ9Rh8jilVaLs2osLyifV7aJuTcEgQyi5mJEZ2CK_sUwrFtxkOuHmN7uvsM8f-3Y_3Dq09Cx5Zgvfo',
    tag: 'New Arrival',
    title: 'Precision at your fingertips',
    subtitle:
      'Engineered for enthusiasts. Explore our curated collection of artisanal mechanical keyboards and bespoke switches.',
    buttonText: 'Shop Now',
    url: '/products',
    enabled: true,
  },
];

export default function HomepageHeroAdminPage() {
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = window.localStorage.getItem('adminHeroSlides');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSlides(parsed);
        }
      } else {
        window.localStorage.setItem('adminHeroSlides', JSON.stringify(DEFAULT_HERO_SLIDES));
      }
    } catch (error) {
      console.error('Failed to load hero slides from localStorage', error);
    } finally {
      setLoaded(true);
    }
  }, []);

  const handleChangeSlide = <K extends keyof HeroSlide>(
    id: string,
    field: K,
    value: HeroSlide[K]
  ) => {
    setSlides((prev) =>
      prev.map((slide) => (slide.id === id ? { ...slide, [field]: value } : slide))
    );
  };

  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      image: '',
      tag: '',
      title: 'New Slide',
      subtitle: '',
      buttonText: 'Shop Now',
      url: '/',
      enabled: true,
    };
    setSlides((prev) => [...prev, newSlide]);
  };

  const handleRemoveSlide = (id: string) => {
    setSlides((prev) => prev.filter((slide) => slide.id !== id));
  };

  const handleSave = () => {
    if (typeof window === 'undefined') return;

    setSaving(true);
    setMessage(null);

    try {
      window.localStorage.setItem('adminHeroSlides', JSON.stringify(slides));
      setMessage('Homepage carousel saved successfully.');
    } catch (error) {
      console.error('Failed to save hero slides to localStorage', error);
      setMessage('Failed to save. Please try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (!loaded) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Loading hero carousel settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Homepage Hero Carousel</h1>
        <button
          type="button"
          onClick={handleAddSlide}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Add Slide
        </button>
      </div>

      <p className="text-sm text-gray-600">
        Manage the slides that appear in the homepage hero carousel. You can configure the{' '}
        <strong>image URL</strong>, <strong>tag</strong>, <strong>title</strong>,{' '}
        <strong>subtitle</strong>, <strong>button text</strong>, and <strong>button URL</strong> for
        each slide.
      </p>

      <div className="space-y-4">
        {slides.length === 0 ? (
          <div className="bg-white rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500 text-sm">
            No slides configured. Click &quot;Add Slide&quot; to create one.
          </div>
        ) : (
          slides.map((slide, index) => (
            <div
              key={slide.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-800">
                  Slide {index + 1}:{' '}
                  <span className="text-gray-500">
                    {slide.title || <span className="italic text-gray-400">Untitled</span>}
                  </span>
                </h2>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={slide.enabled !== false}
                      onChange={(e) => handleChangeSlide(slide.id, 'enabled', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Enabled</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveSlide(slide.id)}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">Image URL *</label>
                  <input
                    type="text"
                    value={slide.image}
                    onChange={(e) => handleChangeSlide(slide.id, 'image', e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-[11px] text-gray-500">
                    Use a high-resolution image (ideally 16:9) for best results.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">Tag / Badge</label>
                  <input
                    type="text"
                    value={slide.tag || ''}
                    onChange={(e) => handleChangeSlide(slide.id, 'tag', e.target.value)}
                    placeholder="e.g. New Arrival, Best Seller"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <label className="block text-xs font-semibold text-gray-700 mt-2">Title *</label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => handleChangeSlide(slide.id, 'title', e.target.value)}
                    placeholder="Main headline for the slide"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">Subtitle</label>
                  <textarea
                    value={slide.subtitle || ''}
                    onChange={(e) => handleChangeSlide(slide.id, 'subtitle', e.target.value)}
                    rows={3}
                    placeholder="Short supporting description"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">Button Text</label>
                  <input
                    type="text"
                    value={slide.buttonText || ''}
                    onChange={(e) => handleChangeSlide(slide.id, 'buttonText', e.target.value)}
                    placeholder="e.g. Shop Now, View Collection"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700">Button URL</label>
                  <input
                    type="text"
                    value={slide.url || ''}
                    onChange={(e) => handleChangeSlide(slide.id, 'url', e.target.value)}
                    placeholder="/products, /collections/slug, or full URL"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-[11px] text-gray-500">
                    When the button is clicked, users will be taken to this URL.
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save Carousel'}
        </button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}


