'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import MobileMenu from './MobileMenu';
import LoginModal from './LoginModal';
import ForgotPasswordModal from './ForgotPasswordModal';

export default function Navbar() {
  const { openCart, getItemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  return (
    <>
      <header className="sticky top-0 z-50 shadow-md">
        <nav className="bg-primary text-white border-b border-white/10 relative">
          <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-10 lg:px-20 h-14 sm:h-16 md:h-20 flex items-center justify-between gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {/* Hamburger Menu Button (Mobile Only) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>

            {/* Logo */}
            <a href="/" className="flex items-center gap-2 shrink-0" aria-label="JioCoder Home">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 shrink-0 overflow-hidden">
                {!logoError ? (
                  <img src="/logo.png" alt="" className="h-8 w-8 object-contain" onError={() => setLogoError(true)} />
                ) : (
                  <span className="material-symbols-outlined text-white text-xl">code</span>
                )}
              </span>
              <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight truncate max-w-[140px] sm:max-w-none">JioCoder</h1>
            </a>

          {/* Search Bar */}
          <div className="flex-1 max-w-3xl hidden md:flex items-center relative z-[60] search-container">
            <div className="flex w-full bg-white rounded-lg overflow-hidden border-2 border-transparent focus-within:border-accent-green transition-all">
              <select className="bg-slate-100 text-slate-700 text-sm font-medium border-none focus:ring-0 px-4 py-2.5 cursor-pointer hover:bg-slate-200 transition-colors">
                <option>All Categories</option>
                <option>Keyboards</option>
                <option>Mouse Pads</option>
                <option>USB Cables</option>
                <option>Mice</option>
              </select>
              <div className="w-px h-6 bg-slate-300 self-center"></div>
              <div className="relative flex-1">
                <input
                  className="w-full border-none focus:ring-0 py-2.5 pl-4 pr-12 text-sm text-slate-900 placeholder-slate-400"
                  placeholder="Search for 'Keyboards'..."
                  type="text"
                />
                <button className="absolute right-0 top-0 h-full px-4 text-slate-500 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">search</span>
                </button>
              </div>
            </div>
            <div className="search-overlay hidden absolute top-full left-0 w-full mt-2 bg-white text-slate-900 shadow-2xl rounded-xl border border-slate-100 overflow-hidden">
              <div className="grid grid-cols-12">
                <div className="col-span-8 p-6 space-y-8">
                  {/* Recent Searches */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-widest flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">history</span>
                      Recent Searches
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <a
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-medium text-slate-600 transition-colors"
                        href="#"
                      >
                        Custom Keycaps
                      </a>
                      <a
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-medium text-slate-600 transition-colors"
                        href="#"
                      >
                        Coiled Cable
                      </a>
                      <a
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-medium text-slate-600 transition-colors"
                        href="#"
                      >
                        Desk Mat XL
                      </a>
                    </div>
                  </div>

                  {/* Popular Categories */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-widest flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">category</span>
                      Popular Categories
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      <a
                        className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 hover:border-accent-green hover:bg-slate-50 transition-all group"
                        href="#"
                      >
                        <div className="w-8 h-8 bg-slate-100 flex items-center justify-center rounded group-hover:bg-accent-green group-hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-sm">keyboard</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700">Mechanical Keyboards</span>
                      </a>
                      <a
                        className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 hover:border-accent-green hover:bg-slate-50 transition-all group"
                        href="#"
                      >
                        <div className="w-8 h-8 bg-slate-100 flex items-center justify-center rounded group-hover:bg-accent-green group-hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-sm">mouse</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700">Gaming Mice</span>
                      </a>
                      <a
                        className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 hover:border-accent-green hover:bg-slate-50 transition-all group"
                        href="#"
                      >
                        <div className="w-8 h-8 bg-slate-100 flex items-center justify-center rounded group-hover:bg-accent-green group-hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-sm">cable</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700">Premium Cables</span>
                      </a>
                    </div>
                  </div>

                  {/* Matching Products */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-widest flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">search_spark</span>
                      Matching Products
                    </h4>
                    <div className="space-y-3">
                      <a
                        className="flex items-center gap-4 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                        href="#"
                      >
                        <img
                          alt="Product"
                          className="w-12 h-12 rounded object-cover border border-slate-100"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVA_-B12wrZHmkzZ0JS_w6YqBEeiWUHL-yo3FEwx9c9gXaJTZSRmBDVKQi4WgAoT1pgIxToDSiT6FRcVKmxerqeO-f9IYBLjIf0ZuyfqFNRhxhDS5Kuo3dGmO2L1BWOd88iu9s6hysFVNVyYWJ_qsjVHKMTsKJeYiMca5mmQ-CvDEDa-H62n7_lAGLE0RXrB0xGRSjU24V7KGl_DwmxjY830FIxC9VpaX14WXWTlwTLNARvo7gzXP97WcgP6hiEXeD8KwXmgJVHRyT"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900">
                            Keychron K2 V2 Wireless Keyboard
                          </p>
                          <p className="text-xs text-slate-500">In Keyboards</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">₹8,499</p>
                          <p className="text-[10px] text-accent-green font-bold">In Stock</p>
                        </div>
                      </a>
                      <a
                        className="flex items-center gap-4 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                        href="#"
                      >
                        <img
                          alt="Product"
                          className="w-12 h-12 rounded object-cover border border-slate-100"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKQyC6WFTf8MJOcWjJFwxdZ56gafGjIO355ezHoArGqNVxMvTh7rSuWRStgoQ2e0SCBcXgVU0QW2IYM3qSa4FZMO9-MIfH_KWadR2rwSHDAF9YZen4Z-E3y1tXF3GrXMChtxeB4u_v4nEJHTWnabdNueSJS0SWbBkwWIKtXFz1Iqlu2JGFHU7MJ3YOZ6O9b_lFV_W3fizQDFR7wleMqzOZ8a16yecgjjuiSvZ_4-WpIfo-W-_npJyLCHNUZJRXbJHkW3BfxMHrQOxh"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900">
                            Ducky One 3 Daybreak TKL
                          </p>
                          <p className="text-xs text-slate-500">In Keyboards</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">₹12,999</p>
                          <p className="text-[10px] text-slate-500">Limited Stock</p>
                        </div>
                      </a>
                    </div>
                    <button className="w-full py-2 text-xs font-bold text-accent-green border border-accent-green/20 rounded-lg hover:bg-accent-green/5 transition-colors">
                      View all 24 matching items
                    </button>
                  </div>
                </div>

                {/* Trending Sidebar */}
                <div className="col-span-4 bg-slate-50 p-6 border-l border-slate-100">
                  <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-red-500 fill-1">trending_up</span>
                    Trending Now
                  </h4>
                  <div className="space-y-4">
                    <a className="flex items-center gap-3 group" href="#">
                      <span className="text-slate-300 font-bold text-lg italic group-hover:text-accent-green">01</span>
                      <span className="text-xs font-semibold text-slate-600 group-hover:text-primary underline-offset-4 decoration-accent-green group-hover:underline">
                        Hall Effect Switches
                      </span>
                    </a>
                    <a className="flex items-center gap-3 group" href="#">
                      <span className="text-slate-300 font-bold text-lg italic group-hover:text-accent-green">02</span>
                      <span className="text-xs font-semibold text-slate-600 group-hover:text-primary underline-offset-4 decoration-accent-green group-hover:underline">
                        Transparent Keycaps
                      </span>
                    </a>
                    <a className="flex items-center gap-3 group" href="#">
                      <span className="text-slate-300 font-bold text-lg italic group-hover:text-accent-green">03</span>
                      <span className="text-xs font-semibold text-slate-600 group-hover:text-primary underline-offset-4 decoration-accent-green group-hover:underline">
                        QMK/VIA Keyboards
                      </span>
                    </a>
                    <a className="flex items-center gap-3 group" href="#">
                      <span className="text-slate-300 font-bold text-lg italic group-hover:text-accent-green">04</span>
                      <span className="text-xs font-semibold text-slate-600 group-hover:text-primary underline-offset-4 decoration-accent-green group-hover:underline">
                        Artisan Esc Keys
                      </span>
                    </a>
                    <a className="flex items-center gap-3 group" href="#">
                      <span className="text-slate-300 font-bold text-lg italic group-hover:text-accent-green">05</span>
                      <span className="text-xs font-semibold text-slate-600 group-hover:text-primary underline-offset-4 decoration-accent-green group-hover:underline">
                        Lubing Kits
                      </span>
                    </a>
                  </div>
                  <div className="mt-8 pt-8 border-t border-slate-200">
                    <div className="bg-primary rounded-lg p-4 relative overflow-hidden">
                      <div className="relative z-10">
                        <p className="text-[10px] text-accent-green font-black uppercase">Flash Sale</p>
                        <h5 className="text-white text-xs font-bold mt-1">Gateron Yellow Switches</h5>
                        <p className="text-[10px] text-white/60">30% OFF - 24h Left</p>
                      </div>
                      <div className="absolute -right-4 -bottom-4 opacity-10">
                        <span className="material-symbols-outlined text-6xl text-white">bolt</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 sm:gap-5 md:gap-6 lg:gap-8 min-w-0">
            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center gap-6 text-sm font-semibold tracking-wide h-20">
              {/* Shop Mega Menu */}
              <div className="mega-menu-trigger h-full flex items-center">
                <a
                  className="text-white hover:text-accent-green transition-colors flex items-center gap-1 cursor-default py-8"
                  href="#"
                >
                  Shop
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </a>
                <div className="mega-menu hidden absolute top-20 left-0 w-full bg-white text-slate-900 shadow-2xl border-t border-slate-100 z-50">
                  <div className="max-w-[1440px] mx-auto px-10 lg:px-20 py-10 grid grid-cols-12 gap-10">
                    {/* Featured Categories */}
                    <div className="col-span-3 space-y-6">
                      <h4 className="text-xs uppercase font-black text-slate-400 tracking-widest">
                        Featured Categories
                      </h4>
                      <div className="space-y-4">
                        <a className="flex items-center gap-4 group" href="#">
                          <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-accent-green group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined">keyboard</span>
                          </div>
                          <span className="font-bold text-slate-700 group-hover:text-primary">Keyboards</span>
                        </a>
                        <a className="flex items-center gap-4 group" href="#">
                          <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-accent-green group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined">mouse</span>
                          </div>
                          <span className="font-bold text-slate-700 group-hover:text-primary">Mice</span>
                        </a>
                        <a className="flex items-center gap-4 group" href="#">
                          <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-accent-green group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined">cable</span>
                          </div>
                          <span className="font-bold text-slate-700 group-hover:text-primary">Cables</span>
                        </a>
                        <a className="flex items-center gap-4 group" href="#">
                          <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-accent-green group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined">layers</span>
                          </div>
                          <span className="font-bold text-slate-700 group-hover:text-primary">Desk Mats</span>
                        </a>
                      </div>
                    </div>

                    {/* Top Brands */}
                    <div className="col-span-3 space-y-6 border-l border-slate-100 pl-10">
                      <h4 className="text-xs uppercase font-black text-slate-400 tracking-widest">Top Brands</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <a className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors" href="#">
                          Keychron
                        </a>
                        <a className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors" href="#">
                          Logitech G
                        </a>
                        <a className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors" href="#">
                          Glorious
                        </a>
                        <a className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors" href="#">
                          Razer
                        </a>
                        <a className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors" href="#">
                          Ducky
                        </a>
                        <a className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors" href="#">
                          Varmilo
                        </a>
                      </div>
                    </div>

                    {/* New Arrivals */}
                    <div className="col-span-3 space-y-6 border-l border-slate-100 pl-10">
                      <h4 className="text-xs uppercase font-black text-slate-400 tracking-widest">New Arrivals</h4>
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <img
                            alt="New keyboard"
                            className="w-12 h-12 rounded object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVA_-B12wrZHmkzZ0JS_w6YqBEeiWUHL-yo3FEwx9c9gXaJTZSRmBDVKQi4WgAoT1pgIxToDSiT6FRcVKmxerqeO-f9IYBLjIf0ZuyfqFNRhxhDS5Kuo3dGmO2L1BWOd88iu9s6hysFVNVyYWJ_qsjVHKMTsKJeYiMca5mmQ-CvDEDa-H62n7_lAGLE0RXrB0xGRSjU24V7KGl_DwmxjY830FIxC9VpaX14WXWTlwTLNARvo7gzXP97WcgP6hiEXeD8KwXmgJVHRyT"
                          />
                          <div>
                            <p className="text-xs font-bold text-primary leading-tight">Artisan Series K2</p>
                            <p className="text-[10px] text-slate-500">Starting from ₹9,999</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <img
                            alt="New mouse"
                            className="w-12 h-12 rounded object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKPTnPR2ZYt_a6VaISccTem49dOMrTwIeqIByZotD0MSDbynXY1x4jRH3kg8-Zh-qrbNn1w0WLg2nfSAzcB8STxJNCIKxO5SUb6EHtAd-_H9SntE78Ey0byBkeSf2PMVLS-ndiYmeQaWRKT5ZdiF4DIJh837aYSuixZD12MhQQN2TxFwEvl014VM1X3bhPHDJmuFIxzRrjbiYKMIu6nIdy13CpeF94iJsBTtzZLSLKI4FKoZrqif0csbfYmFwMxn0qhzkkrBNVyjWB"
                          />
                          <div>
                            <p className="text-xs font-bold text-primary leading-tight">Pro Wireless X</p>
                            <p className="text-[10px] text-slate-500">Starting from ₹7,499</p>
                          </div>
                        </div>
                      </div>
                      <a className="inline-block text-xs font-bold text-accent-green hover:underline" href="#">
                        View All New Drops →
                      </a>
                    </div>

                    {/* Promo Banner */}
                    <div className="col-span-3">
                      <div className="bg-slate-900 rounded-xl p-6 relative overflow-hidden h-full flex flex-col justify-end min-h-[220px]">
                        <img
                          alt="Promo banner"
                          className="absolute inset-0 w-full h-full object-cover opacity-50"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2szADM5ISIXlgO-jmeh_WgCinJ9UftMKB7j6hbRvTZD5ugGjePtpr6m6DVHlXAPcWT6auCrnysq7_CpQwCJnpNpXlF2CwFWG46ax5ECUikI41JhnjQiN_2MxhxVr4VP_vnIIKjaaWwjTH7fUC2MvhBjuJL2RWLMZXlW9j-wgVELmIfI4q2tkSXebnBWq05UTZ9Rh8jilVaLs2osLyifV7aJuTcEgQyi5mJEZ2CK_sUwrFtxkOuHmN7uvsM8f-3Y_3Dq09Cx5Zgvfo"
                        />
                        <div className="relative z-10 space-y-3">
                          <span className="inline-block px-2 py-0.5 bg-accent-green text-primary text-[10px] font-black uppercase rounded">
                            Product of the Month
                          </span>
                          <h5 className="text-white font-bold text-lg leading-tight">Ultimate Coiled Cables</h5>
                          <button className="bg-white text-primary px-4 py-2 rounded text-xs font-bold hover:bg-slate-100 transition-colors">
                            Shop Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Collections */}
              <div className="mega-menu-trigger h-full flex items-center">
                <a className="text-white/80 hover:text-white transition-colors flex items-center gap-1 cursor-default py-8" href="#">
                  Collections
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </a>
              </div>

              {/* Blog */}
              <a className="text-white/80 hover:text-white transition-colors" href="#">
                Blog
              </a>

              {/* Deals */}
              <a className="text-white/80 hover:text-white transition-colors" href="#">
                Deals
              </a>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2 sm:gap-4 md:gap-5 shrink-0">
              <a className="flex flex-col items-center group" href="#">
                <span className="material-symbols-outlined group-hover:text-accent-green transition-colors">
                  favorite
                </span>
                <span className="text-[10px] font-bold uppercase mt-0.5 tracking-tighter text-slate-300">
                  Wishlist
                </span>
              </a>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex flex-col items-center group"
              >
                <span className="material-symbols-outlined group-hover:text-accent-green transition-colors">
                  person
                </span>
                <span className="text-[10px] font-bold uppercase mt-0.5 tracking-tighter text-slate-300">
                  Account
                </span>
              </button>
              <Link
                href="/cart"
                className="flex flex-col items-center group relative"
              >
                <div className="relative">
                  <span className="material-symbols-outlined group-hover:text-accent-green transition-colors">
                    shopping_cart
                  </span>
                  {getItemCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent-green text-primary text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-primary">
                      {getItemCount()}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase mt-0.5 tracking-tighter text-slate-300">Cart</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Secondary Navigation Bar */}
      <div className="bg-white border-b border-slate-200 hidden md:block">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 h-12 flex items-center">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-2">
            <a
              className="text-xs font-bold text-slate-600 hover:text-primary transition-colors whitespace-nowrap flex items-center gap-1.5"
              href="#"
            >
              <span className="material-symbols-outlined text-lg">grid_view</span>
              Shop by Category
            </a>
            <div className="w-px h-4 bg-slate-300"></div>
            <a className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors whitespace-nowrap" href="#">
              Mouse Pads
            </a>
            <a className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors whitespace-nowrap" href="#">
              Keyboard Pads
            </a>
            <a className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors whitespace-nowrap" href="#">
              USB Cables
            </a>
            <a className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors whitespace-nowrap" href="#">
              Keyboards
            </a>
            <a className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors whitespace-nowrap" href="#">
              Mouse
            </a>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-xs font-bold text-accent-green animate-pulse">
              Limited Drop: Artisan Series →
            </span>
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Menu */}
    <MobileMenu 
      isOpen={isMobileMenuOpen} 
      onClose={() => setIsMobileMenuOpen(false)}
      onLoginClick={() => {
        setIsMobileMenuOpen(false);
        setIsLoginModalOpen(true);
      }}
    />

    {/* Login Modal */}
    <LoginModal
      isOpen={isLoginModalOpen}
      onClose={() => setIsLoginModalOpen(false)}
      onForgotPassword={() => setIsForgotPasswordModalOpen(true)}
    />

    {/* Forgot Password Modal */}
    <ForgotPasswordModal
      isOpen={isForgotPasswordModalOpen}
      onClose={() => setIsForgotPasswordModalOpen(false)}
      onBackToLogin={() => setIsLoginModalOpen(true)}
    />
    </>
  );
}

