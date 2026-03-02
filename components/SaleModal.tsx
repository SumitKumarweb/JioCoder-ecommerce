'use client';

import { useEffect, useState } from 'react';

const VISIT_COUNT_KEY = 'home_visit_count';

export default function SaleModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem(VISIT_COUNT_KEY) : null;
      const currentCount = stored ? parseInt(stored, 10) || 0 : 0;
      const newCount = currentCount + 1;
      window.localStorage.setItem(VISIT_COUNT_KEY, String(newCount));

      // Show modal on every 6th visit: 6, 12, 18, ...
      if (newCount % 6 === 0) {
        setIsOpen(true);
      }
    } catch {
      // Fail silently if localStorage is unavailable
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      {/* Modal Container */}
      <div className="relative w-full max-w-[900px] max-h-[95vh] sm:max-h-[90vh] bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300 overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Left Side: Visual Pane */}
        <div className="w-full md:w-1/2 min-h-[200px] sm:min-h-[320px] md:min-h-[400px] relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent z-10" />
          <img
            alt="Premium RGB Gaming Mouse Pad"
            className="absolute inset-0 w-full h-full object-cover object-center"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjDoyekeODajybVX9n2INQcvMNl7ULZ2BxnXpixKg_epck_GX3EysJ3DsVYofMcg0EMNJjTaeKzizjRGWseCoLfQh6DKMjBdXs6uPOsVqXK-5us8lGMM2d1sJig4fA-B0RxWROZo-JdSLkKX0-f17KfhNCLXJOb1W9lI6w_z-_OkkGPu6m_ggi4lAgcWZrNyNIBHLug4AkHEKYEr2FOLzvlCQEIGeyLmdoFRQh6Fo8awef4_0Dfo_FOVugCq-tdiqiDetE6-ySGntl"
          />
          <div className="absolute bottom-8 left-8 z-20">
            <span className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-2">
              Limited Time Offer
            </span>
            <h3 className="text-white text-2xl font-bold">Enhance Your Setup</h3>
          </div>
        </div>

        {/* Right Side: Content Pane */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center text-center md:text-left overflow-y-auto min-h-0">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
              GET <span className="text-white italic">20% OFF</span> YOUR FIRST ORDER!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
              Join the JioCoder community. Sign up for our newsletter to unlock your exclusive discount code and stay
              updated on the latest tech drops.
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
          >
            <div className="space-y-2">
              <label
                className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1"
                htmlFor="sale-modal-email"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white text-xl">
                  mail
                </span>
                <input
                  id="sale-modal-email"
                  type="email"
                  required
                  placeholder="e.g. arjun@example.com"
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
            >
              Claim My Discount
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-medium transition-colors underline decoration-slate-300 dark:decoration-slate-700 underline-offset-4"
            >
              No thanks, I'll pay full price
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center md:justify-start gap-4">
            <span className="material-symbols-outlined text-2xl text-white">verified_user</span>
            <span className="material-symbols-outlined text-2xl text-white">local_shipping</span>
            <span className="material-symbols-outlined text-2xl text-white">payments</span>
          </div>
        </div>
      </div>
    </div>
  );
}

