'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  brand: string;
}

export default function ProductSpotlight() {
  const [spotlightProduct, setSpotlightProduct] = useState<Product | null>(null);

  useEffect(() => {
    const loadSpotlight = async () => {
      try {
        const res = await fetch('/api/section-products?sectionType=SPOTLIGHT');
        if (!res.ok) {
          throw new Error(`Failed to fetch spotlight product: ${res.status}`);
        }
        const data: any[] = await res.json();
        const first = data?.[0]?.product;
        if (first) {
          const product: Product = {
            _id: first._id,
            name: first.name,
            image: first.image,
            price: first.price,
            brand: first.brand ?? 'JioCoder',
          };
          setSpotlightProduct(product);
        } else {
          setSpotlightProduct(null);
        }
      } catch (error) {
        console.error('Failed to load spotlight product from API', error);
      }
    };

    loadSpotlight();
  }, []);

  if (!spotlightProduct) {
    return null;
  }

  return (
    <section className="bg-primary/50 border border-white/10 rounded-3xl p-8 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <h3 className="text-4xl font-bold text-accent-green">{spotlightProduct.name}</h3>
        <p className="text-slate-400 text-lg">
          Engineered for endurance during long coding sprints. Explore the technical innovation that powers our flagship peripheral.
        </p>
        <ul className="space-y-4">
          <li className="flex items-center gap-3 text-slate-200">
            <span className="material-symbols-outlined text-blue-500">speed</span>
            <span>1ms Polling Rate for zero lag</span>
          </li>
          <li className="flex items-center gap-3 text-slate-200">
            <span className="material-symbols-outlined text-blue-500">battery_charging_full</span>
            <span>150-hour Battery Life</span>
          </li>
        </ul>
        <Link
          href={`/product/${spotlightProduct._id}`}
          className="inline-block bg-accent-green text-primary px-8 py-3 rounded-lg font-bold hover:brightness-110 transition-all"
        >
          Pre-order Now
        </Link>
      </div>
      <div className="relative group">
        <img
          alt={spotlightProduct.name}
          className="w-full h-auto rounded-2xl shadow-2xl transition-all duration-500"
          src={spotlightProduct.image}
        />
        {/* Hotspot 1 - DPI Switch */}
        <div className="absolute top-1/4 right-1/4 group-hover:scale-110 transition-transform">
          <div className="relative cursor-pointer group/tip">
            <div className="w-6 h-6 bg-accent-green rounded-full hotspot-pulse flex items-center justify-center shadow-[0_0_15px_#22C55E]">
              <span className="material-symbols-outlined text-primary text-xs font-bold">add</span>
            </div>
            <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-white text-primary p-3 rounded-lg w-48 shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover/tip:opacity-100 group-hover/tip:translate-y-0 transition-all z-20">
              <p className="font-bold text-sm">DPI Switch</p>
              <p className="text-xs">Quick-toggle between 400 and 26,000 DPI presets.</p>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white"></div>
            </div>
          </div>
        </div>
        {/* Hotspot 2 - Ergonomic Grip */}
        <div className="absolute bottom-1/3 left-1/3 group-hover:scale-110 transition-transform">
          <div className="relative cursor-pointer group/tip">
            <div className="w-6 h-6 bg-blue-500 rounded-full hotspot-pulse flex items-center justify-center shadow-[0_0_15px_#3b82f6]">
              <span className="material-symbols-outlined text-white text-xs font-bold">add</span>
            </div>
            <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-white text-primary p-3 rounded-lg w-48 shadow-xl opacity-0 -translate-y-2 pointer-events-none group-hover/tip:opacity-100 group-hover/tip:translate-y-0 transition-all z-20">
              <p className="font-bold text-sm">Ergonomic Grip</p>
              <p className="text-xs">Textured side-panels for maximum precision and comfort.</p>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-8 border-transparent border-b-white"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

