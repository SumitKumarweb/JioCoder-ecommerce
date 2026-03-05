'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useCompare } from '@/contexts/CompareContext';
import { useCart } from '@/contexts/CartContext';
import BestSellersSkeleton from './skeletons/BestSellersSkeleton';

interface BestSellerProduct {
  id: string;
  productId: string;
  badge?: string;
  order: number;
}

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  brand: string;
  rating?: number;
  reviewCount?: number;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`material-symbols-outlined text-sm ${
            star <= rating ? 'fill-1' : 'fill-0'
          }`}
        >
          star
        </span>
      ))}
    </div>
  );
};

export default function BestSellers() {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { addToCart } = useCart();
  const [bestSellers, setBestSellers] = useState<Array<Product & { badge?: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        // Fetch BEST_SELLER section products from public API
        const res = await fetch('/api/section-products?sectionType=BEST_SELLER');
        
        // Handle non-OK responses gracefully
        if (!res.ok) {
          console.warn(`Failed to fetch best sellers: ${res.status}`);
          setBestSellers([]);
          return;
        }
        
        const data: any[] = await res.json();

        const mapped =
          (data ?? [])
            .map((item) => {
              const p = item?.product;
              // Validate product has required fields
              if (!p || !p._id || !p.name || p.price === undefined) {
                return null;
              }
              return {
                id: p.slug || p._id,  // prefer slug for clean URLs
                name: p.name,
                image: p.image || '/placeholder-product.jpg',
                price: p.price,
                originalPrice: undefined,
                brand: p.category || 'JioCoder',
                rating: 4.5,
                reviewCount: 0,
                badge: item.badge,
              } as Product & { badge?: string };
            })
            .filter(
              (x: Product & { badge?: string } | null): x is Product & { badge?: string } =>
                x !== null
            );

        setBestSellers(mapped);
      } catch (error) {
        console.error('Failed to load best sellers', error);
        setBestSellers([]);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const handleCompareChange = (product: Product & { badge?: string }, checked: boolean) => {
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

  if (isLoading) {
    return <BestSellersSkeleton />;
  }

  if (bestSellers.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight">Best Sellers</h3>
      </div>
      <div className="relative px-0 md:px-12">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
          navigation={{
            nextEl: '.best-sellers-swiper-next',
            prevEl: '.best-sellers-swiper-prev',
          }}
          className="best-sellers-swiper"
        >
          {bestSellers.map((product) => (
            <SwiperSlide key={product.id}>
              <a
                href={`/product/${product.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 flex flex-col transition-all hover:shadow-xl hover:-translate-y-1 group h-full"
              >
                <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
                  <img
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={product.image}
                  />
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-slate-900 hover:bg-white transition-colors z-10"
                  >
                    <span className="material-symbols-outlined text-xl">favorite</span>
                  </button>
                </div>
                <div className="p-5 flex-1 flex flex-col space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                        {product.brand}
                      </p>
                      <h4 className="font-semibold text-lg line-clamp-1">{product.name}</h4>
                    </div>
                    {product.badge && (
                      <span className="bg-accent-green/10 text-accent-green text-xs font-bold px-2 py-1 rounded shrink-0">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <StarRating rating={product.rating || 0} />
                    <span className="text-xs text-slate-500 ml-1">
                      ({product.reviewCount || 0} reviews)
                    </span>
                  </div>
                  <div className="mt-auto pt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                        id={`compare-${product.id}`}
                        type="checkbox"
                        checked={isInCompare(product.id)}
                        onChange={(e) => handleCompareChange(product, e.target.checked)}
                      />
                      <label
                        className="text-xs font-medium text-slate-600 cursor-pointer"
                        htmlFor={`compare-${product.id}`}
                      >
                        Add to compare
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-slate-400 line-through text-sm ml-2">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart({
                            id: product.id,
                            name: product.name,
                            image: product.image,
                            price: product.price,
                          });
                        }}
                        className="bg-primary text-white p-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined">add_shopping_cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Navigation Arrows */}
        <button className="best-sellers-swiper-prev absolute left-0 md:left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white shadow-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all hover:scale-110">
          <span className="material-symbols-outlined text-xl md:text-2xl">chevron_left</span>
        </button>
        <button className="best-sellers-swiper-next absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white shadow-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all hover:scale-110">
          <span className="material-symbols-outlined text-xl md:text-2xl">chevron_right</span>
        </button>
      </div>
    </section>
  );
}

