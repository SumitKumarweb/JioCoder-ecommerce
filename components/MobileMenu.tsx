'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick?: () => void;
}

export default function MobileMenu({ isOpen, onClose, onLoginClick }: MobileMenuProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Trigger animation after render
      setTimeout(() => setIsAnimating(true), 10);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      // Remove from DOM after animation
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = '';
      }, 300);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      ></div>

      {/* Slide-out Side Menu */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[450px] max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col overflow-hidden transition-transform duration-300 ease-out ${
          isAnimating ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header: Dark Navy */}
        <header className="bg-primary px-6 py-5 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-white rounded-lg flex items-center justify-center text-primary">
              <img src="/logo.svg" alt="JioCoder" className="h-7 w-7 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">JioCoder</h1>
              <p className="text-[10px] uppercase tracking-widest opacity-80">
                Premium Electronics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        {/* Navigation Content (Scrollable) */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar py-4 px-2">
          <div className="px-4 mb-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Product Categories
            </p>
          </div>

          {/* Category: Keyboards (Accordion) */}
          <details className="group px-2" open>
            <summary className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-primary/5 transition-colors group-open:bg-primary/5">
              <div className="flex items-center gap-3 text-slate-700">
                <span className="material-symbols-outlined text-primary">keyboard</span>
                <span className="font-medium">Keyboards</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">
                expand_more
              </span>
            </summary>
            <div className="pl-12 pr-4 py-2 flex flex-col gap-1">
              <Link
                href="/products?category=mechanical"
                className="py-2 text-sm text-slate-600 hover:text-primary transition-colors"
                onClick={onClose}
              >
                Mechanical Keyboards
              </Link>
              <Link
                href="/products?category=wireless"
                className="py-2 text-sm text-slate-600 hover:text-primary transition-colors"
                onClick={onClose}
              >
                Wireless Keyboards
              </Link>
              <Link
                href="/products?category=gaming"
                className="py-2 text-sm text-slate-600 hover:text-primary transition-colors"
                onClick={onClose}
              >
                Gaming Keyboards
              </Link>
              <Link
                href="/products?category=accessories"
                className="py-2 text-sm text-slate-600 hover:text-primary transition-colors"
                onClick={onClose}
              >
                Keyboard Accessories
              </Link>
            </div>
          </details>

          {/* Category: Mouse */}
          <div className="px-2">
            <Link
              href="/products?category=mouse"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors"
              onClick={onClose}
            >
              <div className="flex items-center gap-3 text-slate-700">
                <span className="material-symbols-outlined text-primary">mouse</span>
                <span className="font-medium">Mouse</span>
              </div>
            </Link>
          </div>

          {/* Category: Mouse Pads */}
          <div className="px-2">
            <Link
              href="/products?category=mousepads"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors"
              onClick={onClose}
            >
              <div className="flex items-center gap-3 text-slate-700">
                <span className="material-symbols-outlined text-primary">rectangle</span>
                <span className="font-medium">Mouse Pads</span>
              </div>
            </Link>
          </div>

          {/* Category: USB Cables */}
          <div className="px-2">
            <Link
              href="/products?category=cables"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors"
              onClick={onClose}
            >
              <div className="flex items-center gap-3 text-slate-700">
                <span className="material-symbols-outlined text-primary">usb</span>
                <span className="font-medium">USB Cables</span>
              </div>
            </Link>
          </div>

          {/* Category: Audio (Accordion) */}
          <details className="group px-2">
            <summary className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-primary/5 transition-colors group-open:bg-primary/5">
              <div className="flex items-center gap-3 text-slate-700">
                <span className="material-symbols-outlined text-primary">headphones</span>
                <span className="font-medium">Audio & Headphones</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">
                expand_more
              </span>
            </summary>
            <div className="pl-12 pr-4 py-2 flex flex-col gap-1">
              <Link
                href="/products?category=monitors"
                className="py-2 text-sm text-slate-600 hover:text-primary transition-colors"
                onClick={onClose}
              >
                Studio Monitors
              </Link>
              <Link
                href="/products?category=headsets"
                className="py-2 text-sm text-slate-600 hover:text-primary transition-colors"
                onClick={onClose}
              >
                Gaming Headsets
              </Link>
              <Link
                href="/products?category=earphones"
                className="py-2 text-sm text-slate-600 hover:text-primary transition-colors"
                onClick={onClose}
              >
                In-ear Monitors
              </Link>
            </div>
          </details>

          {/* Category: PC Components */}
          <div className="px-2">
            <Link
              href="/products?category=components"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors"
              onClick={onClose}
            >
              <div className="flex items-center gap-3 text-slate-700">
                <span className="material-symbols-outlined text-primary">memory</span>
                <span className="font-medium">PC Components</span>
              </div>
            </Link>
          </div>

          {/* Category: Gaming Chairs */}
          <div className="px-2">
            <Link
              href="/products?category=chairs"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors"
              onClick={onClose}
            >
              <div className="flex items-center gap-3 text-slate-700">
                <span className="material-symbols-outlined text-primary">chair_alt</span>
                <span className="font-medium">Gaming Chairs</span>
              </div>
            </Link>
          </div>

          <hr className="mx-6 my-4 border-slate-100" />

          {/* Promotions Banner */}
          <div className="px-4 py-2">
            <div className="bg-primary/10 rounded-xl p-4 flex items-center gap-4">
              <div className="size-12 rounded-lg bg-primary flex items-center justify-center text-white">
                <span className="material-symbols-outlined">sell</span>
              </div>
              <div>
                <p className="text-xs font-bold text-primary uppercase">Special Offer</p>
                <p className="text-sm font-semibold text-slate-800">
                  Festive Sale: Up to 40% Off
                </p>
              </div>
            </div>
          </div>
        </nav>

        {/* Footer Utilities */}
        <footer className="p-6 border-t border-slate-100 bg-white">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Link
              href="/track-order"
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-primary/5 transition-colors group"
              onClick={onClose}
            >
              <span className="material-symbols-outlined text-slate-500 group-hover:text-primary">
                package_2
              </span>
              <span className="text-xs font-medium text-slate-700">Track Order</span>
            </Link>
            <Link
              href="/help"
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-primary/5 transition-colors group"
              onClick={onClose}
            >
              <span className="material-symbols-outlined text-slate-500 group-hover:text-primary">
                help_center
              </span>
              <span className="text-xs font-medium text-slate-700">Help Center</span>
            </Link>
          </div>
          <button
            onClick={() => {
              onClose();
              onLoginClick?.();
            }}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">account_circle</span>
            Login / Signup
          </button>
          <div className="mt-4 text-center">
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              MADE IN INDIA WITH PRIDE
            </p>
          </div>
        </footer>
      </aside>
    </>
  );
}

