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

interface SpotlightData {
  product: Product;
  description?: string;
  features?: Array<{
    icon: string;
    text: string;
  }>;
  hotspots?: Array<{
    position: {
      top?: string;
      bottom?: string;
      left?: string;
      right?: string;
    };
    title: string;
    description: string;
    color?: string;
  }>;
  buttonText?: string;
}

export default function ProductSpotlight() {
  const [spotlightData, setSpotlightData] = useState<SpotlightData | null>(null);

  useEffect(() => {
    const loadSpotlight = async () => {
      try {
        const res = await fetch('/api/section-products?sectionType=SPOTLIGHT');
        if (!res.ok) {
          throw new Error(`Failed to fetch spotlight product: ${res.status}`);
        }
        const data: any[] = await res.json();
        const first = data?.[0];
        
        // Debug logging
        console.log('Spotlight API Response:', first);
        
        if (first?.product) {
          const spotlight: SpotlightData = {
            product: {
              _id: first.product._id,
              name: first.product.name,
              image: first.product.image,
              price: first.product.price,
              brand: first.product.brand ?? first.product.category ?? 'JioCoder',
            },
            description: first.description || undefined,
            features: Array.isArray(first.features) ? first.features : [],
            hotspots: Array.isArray(first.hotspots) ? first.hotspots : [],
            buttonText: first.buttonText || 'Pre-order Now',
          };
          
          console.log('Processed Spotlight Data:', spotlight);
          setSpotlightData(spotlight);
        } else {
          setSpotlightData(null);
        }
      } catch (error) {
        console.error('Failed to load spotlight product from API', error);
      }
    };

    loadSpotlight();
  }, []);

  if (!spotlightData) {
    return null;
  }

  const { product, description, features = [], hotspots = [], buttonText = 'Pre-order Now' } = spotlightData;

  return (
    <section className="bg-[#090F20] border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-around md:flex-row md:px-12 lg:flex-row lg:px-2 gap-24 lg:py-12">
      <div className="space-y-6">
        <h3 className="text-4xl font-bold text-accent-green">{product.name}</h3>
        {description && (
          <p className="text-slate-400 text-lg">
            {description}
          </p>
        )}
        {features.length > 0 && (
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3 text-slate-200">
                <span className="material-symbols-outlined text-blue-500">{feature.icon || 'star'}</span>
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
        )}
        <Link
          href={`/product/${product._id}`}
          className="inline-block bg-accent-green text-primary px-8 py-3 rounded-lg font-bold hover:brightness-110 transition-all"
        >
          {buttonText}
        </Link>
      </div>
      <div className="relative group md:w-[30vh] lg:w-[34vw] lg:h-[75vh]">
        <img
          alt={product.name}
          className="w-full h-full object-cover rounded-2xl shadow-2xl transition-all duration-500"
          src={product.image}
        />
        {/* Dynamic Hotspots */}
        {hotspots.map((hotspot, index) => {
          const positionStyle: React.CSSProperties = {};
          if (hotspot.position.top) positionStyle.top = hotspot.position.top;
          if (hotspot.position.bottom) positionStyle.bottom = hotspot.position.bottom;
          if (hotspot.position.left) positionStyle.left = hotspot.position.left;
          if (hotspot.position.right) positionStyle.right = hotspot.position.right;

          const isTopPosition = hotspot.position.top || (!hotspot.position.bottom && !hotspot.position.top);
          const tooltipPosition = isTopPosition ? 'bottom-full mb-4' : 'top-full mt-4';
          const tooltipTranslate = isTopPosition ? 'translate-y-2' : '-translate-y-2';
          const arrowPosition = isTopPosition ? 'top-full' : 'bottom-full';
          const arrowBorder = isTopPosition ? 'border-t-white' : 'border-b-white';

          return (
            <div
              key={index}
              className="absolute group-hover:scale-110 transition-transform"
              style={positionStyle}
            >
              <div className="relative cursor-pointer group/tip">
                <div
                  className="w-6 h-6 rounded-full hotspot-pulse flex items-center justify-center shadow-[0_0_15px_currentColor]"
                  style={{
                    backgroundColor: hotspot.color || '#22C55E',
                  }}
                >
                  <span
                    className="material-symbols-outlined text-xs font-bold"
                    style={{
                      color: hotspot.color === '#3b82f6' || hotspot.color === '#2563eb' || hotspot.color === '#3B82F6' ? 'white' : '#0F172A',
                    }}
                  >
                    add
                  </span>
                </div>
                <div className={`absolute ${tooltipPosition} left-1/2 -translate-x-1/2 bg-white text-primary p-3 rounded-lg w-48 shadow-xl opacity-0 ${tooltipTranslate} pointer-events-none group-hover/tip:opacity-100 group-hover/tip:translate-y-0 transition-all z-20`}>
                  <p className="font-bold text-sm">{hotspot.title}</p>
                  <p className="text-xs">{hotspot.description}</p>
                  <div className={`absolute ${arrowPosition} left-1/2 -translate-x-1/2 border-8 border-transparent ${arrowBorder}`}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

