'use client';

import { useEffect, useMemo, useState } from 'react';

const VISIT_COUNT_KEY = 'home_visit_count';

type SaleModalConfig = {
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
};

const FALLBACK_CONFIG: SaleModalConfig = {
  enabled: true,
  showEveryNthVisit: 6,
  leftImageUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAjDoyekeODajybVX9n2INQcvMNl7ULZ2BxnXpixKg_epck_GX3EysJ3DsVYofMcg0EMNJjTaeKzizjRGWseCoLfQh6DKMjBdXs6uPOsVqXK-5us8lGMM2d1sJig4fA-B0RxWROZo-JdSLkKX0-f17KfhNCLXJOb1W9lI6w_z-_OkkGPu6m_ggi4lAgcWZrNyNIBHLug4AkHEKYEr2FOLzvlCQEIGeyLmdoFRQh6Fo8awef4_0Dfo_FOVugCq-tdiqiDetE6-ySGntl',
  leftImageAlt: 'Premium RGB Gaming Mouse Pad',
  leftBadgeText: 'Limited Time Offer',
  leftHeading: 'Enhance Your Setup',
  titlePrefix: 'GET',
  titleHighlight: '20% OFF',
  titleSuffix: 'YOUR FIRST ORDER!',
  description:
    'Join the JioCoder community. Sign up for our newsletter to unlock your exclusive discount code and stay updated on the latest tech drops.',
  emailLabel: 'Email Address',
  emailPlaceholder: 'e.g. arjun@example.com',
  submitButtonText: 'Claim My Discount',
  dismissText: "No thanks, I'll pay full price",
  bottomIcons: ['verified_user', 'local_shipping', 'payments'],
};

export default function SaleModal({ forceOpen = false }: { forceOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<SaleModalConfig>(FALLBACK_CONFIG);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/sale-modal', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as Partial<SaleModalConfig>;
        if (cancelled) return;
        setConfig((prev) => ({ ...prev, ...(data as any) }));
      } catch {
        // keep fallback config
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const effectiveConfig = useMemo(() => {
    const safeNth = Number(config.showEveryNthVisit) > 0 ? Number(config.showEveryNthVisit) : 6;
    const safeIcons = Array.isArray(config.bottomIcons) ? config.bottomIcons : FALLBACK_CONFIG.bottomIcons;
    return { ...config, showEveryNthVisit: safeNth, bottomIcons: safeIcons };
  }, [config]);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    if (!effectiveConfig.enabled) return;

    try {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem(VISIT_COUNT_KEY) : null;
      const currentCount = stored ? parseInt(stored, 10) || 0 : 0;
      const newCount = currentCount + 1;
      window.localStorage.setItem(VISIT_COUNT_KEY, String(newCount));

      // Show modal on every Nth visit: N, 2N, 3N, ...
      if (newCount % effectiveConfig.showEveryNthVisit === 0) {
        setIsOpen(true);
      }
    } catch {
      // Fail silently if localStorage is unavailable
    }
  }, [forceOpen, effectiveConfig.enabled, effectiveConfig.showEveryNthVisit]);

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
            alt={effectiveConfig.leftImageAlt || FALLBACK_CONFIG.leftImageAlt}
            className="absolute inset-0 w-full h-full object-cover object-center"
            src={effectiveConfig.leftImageUrl || FALLBACK_CONFIG.leftImageUrl}
          />
          <div className="absolute bottom-8 left-8 z-20">
            <span className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-2">
              {effectiveConfig.leftBadgeText || FALLBACK_CONFIG.leftBadgeText}
            </span>
            <h3 className="text-white text-2xl font-bold">
              {effectiveConfig.leftHeading || FALLBACK_CONFIG.leftHeading}
            </h3>
          </div>
        </div>

        {/* Right Side: Content Pane */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center text-center md:text-left overflow-y-auto min-h-0">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
              {effectiveConfig.titlePrefix}{' '}
              <span className="text-white italic">{effectiveConfig.titleHighlight}</span>{' '}
              {effectiveConfig.titleSuffix}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
              {effectiveConfig.description}
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitMessage(null);

              const trimmed = email.trim();
              if (!trimmed) {
                setSubmitMessage('Please enter your email.');
                return;
              }

              setSubmitting(true);
              try {
                const pagePath =
                  typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : undefined;
                const referrer = typeof document !== 'undefined' ? document.referrer : undefined;
                const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : undefined;

                const res = await fetch('/api/sale-modal/lead', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    email: trimmed,
                    source: 'sale-modal',
                    tags: ['sale-modal'],
                    pagePath,
                    referrer,
                    userAgent,
                  }),
                });

                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                  setSubmitMessage(data?.message || 'Failed to submit. Please try again.');
                  return;
                }

                setSubmitMessage('Thanks! We saved your email.');
                setEmail('');
                // Close shortly after success
                setTimeout(() => setIsOpen(false), 800);
              } catch {
                setSubmitMessage('Failed to submit. Please try again.');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <div className="space-y-2">
              <label
                className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1"
                htmlFor="sale-modal-email"
              >
                {effectiveConfig.emailLabel}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white text-xl">
                  mail
                </span>
                <input
                  id="sale-modal-email"
                  type="email"
                  required
                  placeholder={effectiveConfig.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? 'Submitting...' : effectiveConfig.submitButtonText}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>

            {submitMessage && (
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center md:text-left">
                {submitMessage}
              </p>
            )}
          </form>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-medium transition-colors underline decoration-slate-300 dark:decoration-slate-700 underline-offset-4"
            >
              {effectiveConfig.dismissText}
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center md:justify-start gap-4">
            {(effectiveConfig.bottomIcons || []).slice(0, 6).map((icon, idx) => (
              <span key={`${icon}-${idx}`} className="material-symbols-outlined text-2xl text-white">
                {icon}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

