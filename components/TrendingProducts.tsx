'use client';

import { useState, useEffect, useRef } from 'react';
import { useCompare } from '@/contexts/CompareContext';
import TrendingProductsSkeleton from './skeletons/TrendingProductsSkeleton';
import { useInViewOnce } from '@/hooks/useInViewOnce';
import { useHomepageFetchQueue } from '@/components/home/HomepageFetchQueue';

interface Product {
  _id: string;
  id: string;
  compareId: string;
  name: string;
  price: number;
  image: string;
}

export default function TrendingProducts() {
  const { wrapperRef, shouldLoad } = useInViewOnce();
  const enqueue = useHomepageFetchQueue();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!shouldLoad) return;
    const ac = new AbortController();
    let cancelled = false;

    enqueue(async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/section-products?sectionType=TRENDING', {
          signal: ac.signal,
        });

        if (!res.ok) {
          if (!ac.signal.aborted && !cancelled) {
            console.warn(`Failed to fetch trending products: ${res.status}`);
            setTrendingProducts([]);
          }
          return;
        }

        const data: { product?: { _id: string; name: string; price: number; slug?: string; image?: string } }[] =
          await res.json();

        const mapped: Product[] =
          (data || [])
            .map((item) => item?.product)
            .filter((p): p is NonNullable<typeof p> => Boolean(p && p._id && p.name && p.price !== undefined))
            .map((p) => ({
              _id: p._id,
              id: p.slug || p._id,
              compareId: `trending-${p._id}`,
              name: p.name,
              price: p.price,
              image: p.image || '/placeholder-product.jpg',
            })) || [];

        if (!cancelled && !ac.signal.aborted) {
          setTrendingProducts(mapped);
        }
      } catch (error) {
        if (ac.signal.aborted || cancelled) return;
        console.error('Failed to load trending products from API', error);
        setTrendingProducts([]);
      } finally {
        if (!cancelled && !ac.signal.aborted) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [shouldLoad, enqueue]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -320,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 320,
        behavior: 'smooth',
      });
    }
  };

  const handleCompareChange = (product: Product, checked: boolean) => {
    if (checked) {
      addToCompare({
        id: product.id,
        name: product.name,
        image: product.image,
        price: `₹${product.price.toLocaleString()}`,
      });
    } else {
      removeFromCompare(product.id);
    }
  };

  return (
    <div ref={wrapperRef} className="min-w-0">
      {(!shouldLoad || isLoading) && <TrendingProductsSkeleton />}
      {shouldLoad && !isLoading && trendingProducts.length > 0 ? (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-orange-500 fill-1">
            trending_up
          </span>
          <h3 className="text-2xl font-bold tracking-tight">Trending Right Now</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={scrollRight}
            className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-6 pb-4 no-scrollbar"
      >
        {trendingProducts.map((product) => (
          <div
            key={product.id}
            className="min-w-[300px] bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 flex flex-col transition-all hover:shadow-md group"
          >
              <a href={`/product/${product.id}`} className="relative aspect-square bg-slate-50 overflow-hidden block">
              <span className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] fill-1">bolt</span>
                Trending
              </span>
              <img
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={product.image}
              />
              <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-slate-900 hover:bg-white transition-colors z-10 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">favorite</span>
              </button>
            </a>
            <div className="p-4 flex-1 flex flex-col space-y-2">
              <a href={`/product/${product.id}`} className="font-semibold text-base line-clamp-1 hover:text-primary transition-colors">
                {product.name}
              </a>
              <p className="text-xl font-bold">₹{product.price.toLocaleString()}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <input
                  className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                  id={product.compareId}
                  type="checkbox"
                  checked={isInCompare(product.id)}
                  onChange={(e) => handleCompareChange(product, e.target.checked)}
                />
                <label
                  className="text-xs font-medium text-slate-600 cursor-pointer"
                  htmlFor={product.compareId}
                >
                  Add to compare
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
      ) : null}
    </div>
  );
}

