'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { useCart } from '@/contexts/CartContext';
import Breadcrumb from '@/components/Breadcrumb';
import ProductDetailSkeleton from '@/components/ProductDetailSkeleton';
import LazySection from '@/components/LazySection';
import {
  TechnicalSpecsSkeleton,
  FAQSkeleton,
  ReviewsSkeleton,
  CompleteSetupSkeleton,
  RecentlyViewedSkeleton,
} from '@/components/ProductDetailSectionSkeletons';
import ProductCarouselSkeleton from '@/components/ProductCarouselSkeleton';
import { getCachedData, setCachedData, getProductCacheKey } from '@/utils/apiCache';

interface ProductDetailProps {
  productId: string;
  collectionSlug?: string;
}

interface ProductData {
  id: string;
  slug?: string;
  name: string;
  image?: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  description?: string;
  category?: string;
}

export default function ProductDetail({ productId, collectionSlug }: ProductDetailProps) {
  const [selectedSwitch, setSelectedSwitch] = useState('Tactile Blue');
  const [quantity, setQuantity] = useState(1);
  const swiperRef = useRef<SwiperType | null>(null);
  const router = useRouter();
  const { addToCart, buyNow } = useCart();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef<string | null>(null);
  const redirectingRef = useRef(false);

  useEffect(() => {
    // Skip if already loading the same productId (prevents duplicate calls)
    if (loadingRef.current === productId) return;
    
    // Skip if product already loaded matches current productId
    if (product && (product.id === productId || product.slug === productId)) {
      setLoading(false);
      return;
    }

    loadingRef.current = productId;
    redirectingRef.current = false;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check cache first to avoid duplicate API calls
        const cacheKey = getProductCacheKey(productId);
        const cachedData = getCachedData<any>(cacheKey);
        
        if (cachedData) {
          const productData = {
            id: cachedData._id,
            slug: cachedData.slug,
            name: cachedData.name,
            image: cachedData.image,
            price: cachedData.price,
            inStock: cachedData.inStock,
            description: cachedData.description,
            category: cachedData.category,
          };
          setProduct(productData);
          setLoading(false);
          loadingRef.current = null;
          
          // Handle redirect if needed (only once)
          if (cachedData.slug && productId !== cachedData.slug && !redirectingRef.current) {
            redirectingRef.current = true;
            if (collectionSlug) {
              router.replace(`/collections/${collectionSlug}/${cachedData.slug}`, { scroll: false });
            } else {
              router.replace(`/product/${cachedData.slug}`, { scroll: false });
            }
          }
          return;
        }
        
        // Fetch product data with retry logic
        let data: any = null;
        let lastError: Error | null = null;
        const maxRetries = 3;
        const retryDelay = 1000; // Start with 1 second
        const timeout = 10000; // 10 second timeout

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const res = await fetch(`/api/products/${productId}`, {
              signal: controller.signal,
            });
            
            clearTimeout(timeoutId);

            if (!res.ok) {
              loadingRef.current = null;
              if (res.status === 404) {
                setError('Product not found');
                setProduct(null);
                return;
              } else if (res.status === 503) {
                // Service unavailable - retry
                if (attempt < maxRetries) {
                  console.warn(`[ProductDetail] Service unavailable, retrying... (attempt ${attempt}/${maxRetries})`);
                  await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
                  continue;
                } else {
                  setError('Service temporarily unavailable. Please refresh the page.');
                  setProduct(null);
                  return;
                }
              } else {
                setError('Failed to load product details');
                setProduct(null);
                return;
              }
            }

            data = await res.json();
            break; // Success, exit retry loop
          } catch (fetchError: any) {
            lastError = fetchError;
            
            // Check if it's a timeout or network error that we should retry
            const isRetryableError = 
              fetchError?.name === 'AbortError' ||
              fetchError?.name === 'TypeError' ||
              fetchError?.message?.includes('fetch') ||
              fetchError?.message?.includes('network') ||
              fetchError?.message?.includes('timeout');

            if (isRetryableError && attempt < maxRetries) {
              console.warn(`[ProductDetail] Network error, retrying... (attempt ${attempt}/${maxRetries}):`, fetchError.message);
              await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
              continue;
            } else {
              // Non-retryable error or max retries reached
              console.error('[ProductDetail] Failed to fetch product:', fetchError);
              loadingRef.current = null;
              setError('Failed to load product details. Please check your connection and try again.');
              setProduct(null);
              return;
            }
          }
        }

        if (!data) {
          loadingRef.current = null;
          setError(lastError ? 'Failed to load product details' : 'No data received');
          setProduct(null);
          return;
        }
        
        // Cache the response to prevent duplicate calls
        setCachedData(cacheKey, data, 5 * 60 * 1000); // 5 minutes cache
        
        const productData = {
          id: data._id,
          slug: data.slug,
          name: data.name,
          image: data.image,
          price: data.price,
          inStock: data.inStock,
          description: data.description,
          category: data.category,
        };
        
        setProduct(productData);
        loadingRef.current = null;

        // If productId is a MongoDB ID (not a slug), redirect to the clean slug URL
        // This ensures URLs always use product names, never MongoDB IDs
        // Only redirect once to prevent loops
        if (data.slug && productId !== data.slug && !redirectingRef.current) {
          redirectingRef.current = true;
          if (collectionSlug) {
            // Redirect to collection product URL: /collections/[collectionSlug]/[productSlug]
            router.replace(`/collections/${collectionSlug}/${data.slug}`, { scroll: false });
          } else {
            // Redirect to standalone product URL: /product/[productSlug]
            router.replace(`/product/${data.slug}`, { scroll: false });
          }
        }
      } catch (e) {
        console.error('Failed to load product', e);
        loadingRef.current = null;
        setError('Failed to load product details');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, collectionSlug]);

  const switchTypes = ['Tactile Blue', 'Linear Red', 'Silent Brown'];

  const increaseQuantity = () => setQuantity((q) => q + 1);
  const decreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  if (loading) {
    return (
      <>
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-6 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-16"></div>
          <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
          <div className="h-4 bg-slate-200 rounded w-24"></div>
          <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
          <div className="h-4 bg-slate-200 rounded w-32"></div>
        </div>
        <ProductDetailSkeleton />
      </>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <span className="material-symbols-outlined text-5xl text-gray-300 mb-3">inventory_2</span>
        <p className="text-gray-700 font-semibold mb-2">
          {error || 'Product not found.'}
        </p>
        <button
          onClick={() => router.push('/products')}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb: Home > Collections > Collection Name > Product Name */}
      <Breadcrumb
        items={
          collectionSlug
            ? [
                { label: 'Home', href: '/' },
                { label: 'Collections', href: '/collections' },
                { label: collectionSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), href: `/collections/${collectionSlug}` },
                { label: product.name },
              ]
            : [
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/products' },
                { label: product.name },
              ]
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
        {/* Product Image — only the admin-uploaded image is shown */}
        <div className="lg:col-span-7">
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 border border-slate-200 group">
            {product.image ? (
              <img
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                src={product.image}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                <span className="material-symbols-outlined text-7xl mb-2">image</span>
                <p className="text-sm font-medium">No image uploaded</p>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary leading-tight mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-amber-500">
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined">star_half</span>
                <span className="ml-2 text-sm font-semibold text-slate-600 underline">
                  1,240 reviews
                </span>
              </div>
              <span className="h-4 w-px bg-slate-300"></span>
              <span className="text-emerald-600 text-sm font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Price Card */}
          <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-xl space-y-4 shadow-sm">
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl md:text-4xl font-black text-primary">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-sm text-slate-500">Inclusive of all taxes. Free express shipping.</p>
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-lg">local_shipping</span>
                <span className="text-sm font-semibold">Delivery Estimate</span>
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-primary focus:border-primary"
                  placeholder="Enter Pincode"
                  type="text"
                />
                <button className="px-4 py-2 text-sm font-bold text-primary border border-primary rounded-lg hover:bg-primary/5">
                  Check
                </button>
              </div>
            </div>
          </div>

          {/* Switch Type Selection */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-bold mb-3 uppercase tracking-wider text-slate-500">
                Switch Type
              </p>
              <div className="flex gap-3">
                {switchTypes.map((switchType) => (
                  <button
                    key={switchType}
                    onClick={() => setSelectedSwitch(switchType)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                      selectedSwitch === switchType
                        ? 'border-2 border-primary bg-primary/5 text-primary'
                        : 'border border-slate-200 hover:border-primary'
                    }`}
                  >
                    {switchType}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-sm font-bold mb-3 uppercase tracking-wider text-slate-500">
                Quantity
              </p>
              <div className="flex items-center border border-slate-200 w-fit rounded-lg overflow-hidden bg-white">
                <button onClick={decreaseQuantity} className="p-2 hover:bg-slate-50">
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <input
                  className="w-12 text-center border-none text-sm font-bold focus:ring-0"
                  type="text"
                  value={quantity}
                  readOnly
                />
                <button onClick={increaseQuantity} className="p-2 hover:bg-slate-50">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => {
                addToCart({
                  id: product.id,
                  name: product.name,
                  image: product.image || '',
                  price: product.price,
                  variant: `${selectedSwitch} Switch`,
                });
              }}
              className="flex-1 bg-white border-2 border-primary text-primary font-bold py-4 rounded-xl hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              Add to Cart
            </button>
            <button
              onClick={() => {
                buyNow({
                  id: product.id,
                  name: product.name,
                  image: product.image || '',
                  price: product.price,
                  variant: `${selectedSwitch} Switch`,
                }, quantity);
                router.push('/checkout');
              }}
              className="flex-1 bg-primary text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">flash_on</span>
              Buy Now
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-2 pt-6">
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50">
              <span className="material-symbols-outlined text-primary mb-1">verified_user</span>
              <span className="text-[10px] font-bold uppercase">2 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50">
              <span className="material-symbols-outlined text-primary mb-1">sync</span>
              <span className="text-[10px] font-bold uppercase">7 Day Return</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50">
              <span className="material-symbols-outlined text-primary mb-1">delivery_dining</span>
              <span className="text-[10px] font-bold uppercase">Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <LazySection
        skeleton={<TechnicalSpecsSkeleton />}
      >
      <section className="mt-20">
        <h2 className="text-2xl font-black mb-8 border-b-2 border-primary w-fit pb-2">
          Technical Specifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">keyboard</span>
                Build & Layout
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <dt className="text-slate-500">Form Factor</dt>
                  <dd className="font-semibold">Full-size (104 keys)</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <dt className="text-slate-500">Chassis</dt>
                  <dd className="font-semibold">Aircraft-grade Aluminum</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <dt className="text-slate-500">Keycaps</dt>
                  <dd className="font-semibold">Double-shot PBT</dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">settings_input_component</span>
                Performance
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <dt className="text-slate-500">Switch Type</dt>
                  <dd className="font-semibold text-primary">SteelSeries OmniPoint</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <dt className="text-slate-500">Actuation</dt>
                  <dd className="font-semibold">0.4mm to 3.6mm</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <dt className="text-slate-500">Response Time</dt>
                  <dd className="font-semibold">0.7ms</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
      </LazySection>

      {/* FAQ Section */}
      <LazySection
        skeleton={<FAQSkeleton />}
      >
      <section className="mt-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-black border-b-2 border-primary w-fit pb-2">
            Questions & Answers
          </h2>
          <p className="text-sm text-slate-500">Common pre-purchase concerns addressed by experts</p>
        </div>
        <div className="max-w-4xl space-y-4">
          <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm" open>
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-slate-50 transition-colors">
              <span className="font-bold text-slate-800">
                Is this keyboard hot-swappable?
              </span>
              <span className="material-symbols-outlined faq-icon text-primary transition-transform group-open:rotate-180">
                expand_more
              </span>
            </summary>
            <div className="p-5 pt-0 border-t border-slate-100 text-slate-600 text-sm leading-relaxed">
              Yes, this edition of the Apex Pro features a hot-swappable PCB. You can easily swap out the mechanical switches for any 3-pin or 5-pin MX compatible switches without any soldering required.
            </div>
          </details>
          <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-slate-50 transition-colors">
              <span className="font-bold text-slate-800">Does it support macOS?</span>
              <span className="material-symbols-outlined faq-icon text-primary transition-transform group-open:rotate-180">
                expand_more
              </span>
            </summary>
            <div className="p-5 pt-0 border-t border-slate-100 text-slate-600 text-sm leading-relaxed">
              Absolutely. It is fully compatible with macOS. While the default keycaps are in Windows layout, the keyboard includes a set of macOS-specific keycaps and a built-in toggle to switch the internal mapping for Cmd/Option keys.
            </div>
          </details>
          <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-slate-50 transition-colors">
              <span className="font-bold text-slate-800">
                Does it have a dedicated Indian Rupee (₹) symbol key?
              </span>
              <span className="material-symbols-outlined faq-icon text-primary transition-transform group-open:rotate-180">
                expand_more
              </span>
            </summary>
            <div className="p-5 pt-0 border-t border-slate-100 text-slate-600 text-sm leading-relaxed">
              Yes, as this is the Indian Edition, the ₹ symbol is printed on the '4' key and can be accessed via the standard AltGr + 4 shortcut. The layout is optimized for the Indian market.
            </div>
          </details>
          <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-slate-50 transition-colors">
              <span className="font-bold text-slate-800">What is the cable length?</span>
              <span className="material-symbols-outlined faq-icon text-primary transition-transform group-open:rotate-180">
                expand_more
              </span>
            </summary>
            <div className="p-5 pt-0 border-t border-slate-100 text-slate-600 text-sm leading-relaxed">
              The keyboard comes with a detachable 2-meter braided USB-C to USB-A cable, ensuring plenty of length for most desktop setups and high durability.
            </div>
          </details>
        </div>
        <div className="mt-6">
          <button className="text-sm font-bold text-primary flex items-center gap-2 hover:underline">
            <span className="material-symbols-outlined text-base">forum</span>
            Have another question? Ask our experts
          </button>
        </div>
      </section>
      </LazySection>

      {/* Customer Reviews */}
      <LazySection
        skeleton={<ReviewsSkeleton />}
      >
      <section className="mt-20">
        <h2 className="text-2xl font-black mb-8 border-b-2 border-primary w-fit pb-2">
          Verified Customer Reviews
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
          <div className="lg:col-span-4 p-8 bg-white border border-slate-200 rounded-xl h-fit">
            <div className="text-center mb-8">
              <p className="text-6xl font-black text-primary mb-2">4.8</p>
              <div className="flex justify-center text-amber-500 mb-2">
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined">star_half</span>
              </div>
              <p className="text-slate-500 text-sm font-medium">Based on 1,240 reviews</p>
            </div>
            <div className="space-y-3">
              {[85, 10, 3, 1, 1].map((percentage, index) => (
                <div key={index} className="flex items-center gap-4 text-sm">
                  <span className="w-12 font-bold text-slate-600">{5 - index} Star</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-10 text-right text-slate-500">{percentage}%</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors">
              Write a Review
            </button>
          </div>
          <div className="lg:col-span-8 space-y-8">
            <div className="pb-8 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-primary">
                    AK
                  </div>
                  <div>
                    <p className="font-bold">Arjun Kumar</p>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      Verified Buyer
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">2 days ago</span>
              </div>
              <div className="flex text-amber-500 text-xs mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="material-symbols-outlined fill-1">
                    star
                  </span>
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed">
                Best keyboard I've ever used. The actuation settings are a game changer for switching between typing and gaming. The Indian layout is exactly what I needed. Build quality is top-notch!
              </p>
              <div className="mt-4 flex gap-4">
                <button className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-primary">
                  <span className="material-symbols-outlined text-sm">thumb_up</span>
                  Helpful (24)
                </button>
                <button className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-rose-600">
                  <span className="material-symbols-outlined text-sm">flag</span>
                  Report
                </button>
              </div>
            </div>
            <div className="pb-8 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-primary">
                    SM
                  </div>
                  <div>
                    <p className="font-bold">Siddharth M.</p>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      Verified Buyer
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">1 week ago</span>
              </div>
              <div className="flex text-amber-500 text-xs mb-3">
                {[1, 2, 3, 4].map((star) => (
                  <span key={star} className="material-symbols-outlined fill-1">
                    star
                  </span>
                ))}
                <span className="material-symbols-outlined">star</span>
              </div>
              <p className="text-slate-700 leading-relaxed mb-4">
                The RGB lighting is stunning and very customizable. The wrist rest is very comfortable for long coding sessions. Highly recommended for professionals and gamers alike.
              </p>
              <div className="flex gap-2">
                <img
                  alt="Review Image 1"
                  className="h-16 w-16 rounded-lg object-cover border border-slate-200"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPFWRF-fDWjeN53XSN6Ly6r040yxLxLI8PX3Mpq3RxSjycHHjF_nziqJnvRPzqaeSi0g83zNq_UDdcVeLzX4b_vppnMb2CHWYEJ6_tH9kcg01Wl3FIhYVbNKwLRXEwPOWg-DRf1FQgoEPb3Yxe4HIy2neOJwjh2XUXXoPGX83xBePt7dlys856rBlr9rwJC1eJMXfEHMqdeSy7mteTvlzBcW2eJ2e0TsppYtcH-gyf_iRAyOjfGjQ2UjcYw8cp0qGQhC24UugTDKW4"
                />
                <img
                  alt="Review Image 2"
                  className="h-16 w-16 rounded-lg object-cover border border-slate-200"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDM_KC5nxeVvtfzBl3oVUZjxLchqaLeLsvIdAgqAtmoGy-nsreFd3Pj_mkavLqI-3-dPHl8MXXQDelCL89OiV9TufdurrOiPoh2Iy5WNhvXHOODvMI170GadB8niSgVdvaF7KolGV9ee1XJvAE3HcRBozfU7LWCgbM2meBgcsCcbY0fylM-6ygEUf4OyKaMqxFV4sf7jNO9j7NInBVai7HHhfU4l7EobElktkqZLHWZIzljpLRcHg7YxDgrvlx7fZyYag-I6LB-Unt5"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      </LazySection>

      {/* Complete Your Setup */}
      <LazySection
        skeleton={<CompleteSetupSkeleton />}
      >
      <section className="mt-20">
        <h2 className="text-2xl font-black mb-8 border-b-2 border-primary w-fit pb-2 uppercase tracking-tight">
          Complete Your Setup
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group">
            <div className="aspect-square rounded-lg overflow-hidden bg-slate-50 mb-4 relative">
              <img
                alt="Premium Mouse Pad"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0sxfqAAkLgJEPk_UMFYOaaJc1CfXxGGZniFZY8e2B-8h42ZVHvF0XxWYIWum7FgHGGVwAE0VrEc5k2h5U8-Tpanrn_bhR-Zs_gotQ9z7SIFuOtRmC6ZCGP-92ccBZoBNDp4zx4eXGx0paZhDsLIjHyE-jt5dS7-kNDNII-9buD_xZWCidE2o7zGx9S6GyTAF7jDAlJvsFTBT6rkMpscPYVSGEA483kU7lbYBK4bPcSmc6YbGglIMU3MXqcItlWAyHcSWP1pIm-XYT"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-sm">Pro-Glide XL RGB Mouse Pad</h3>
              <div className="flex items-center justify-between">
                <span className="font-black text-primary">₹2,499</span>
                <button
                  onClick={() => {
                    addToCart({
                      id: 'setup-mousepad',
                      name: 'Pro-Glide XL RGB Mouse Pad',
                      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0sxfqAAkLgJEPk_UMFYOaaJc1CfXxGGZniFZY8e2B-8h42ZVHvF0XxWYIWum7FgHGGVwAE0VrEc5k2h5U8-Tpanrn_bhR-Zs_gotQ9z7SIFuOtRmC6ZCGP-92ccBZoBNDp4zx4eXGx0paZhDsLIjHyE-jt5dS7-kNDNII-9buD_xZWCidE2o7zGx9S6GyTAF7jDAlJvsFTBT6rkMpscPYVSGEA483kU7lbYBK4bPcSmc6YbGglIMU3MXqcItlWAyHcSWP1pIm-XYT',
                      price: 2499,
                    });
                  }}
                  className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">add</span> Add
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group">
            <div className="aspect-square rounded-lg overflow-hidden bg-slate-50 mb-4 relative">
              <img
                alt="Memory Foam Wrist Rest"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2I-uABkYoYjL69fsMvG8Iqm9a1FlzTHRJ4CSA7N5lOQLHk_q6exQesz4-o_IrHM-jKZKDCyBnFRlK9gSVHQDi3i4aP7lqYIGyJKutoufRbXE9aqaZLwNBnbup6Kdbnp7HG9MblCSbofjNa9i5Fwh7lzmD60iHdzdXyzgtqhkdK9IbvJ2oPztbKGqqZ_XLU5lNLVpfoXmiQwLV3jbstp3buzeOfppmi6AX8cV-u3aFQU5CeW01wiqjiljaBo9XoY64GGP6YshGMxfQ"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-sm">
                Ergo-Cloud Memory Foam Wrist Rest
              </h3>
              <div className="flex items-center justify-between">
                <span className="font-black text-primary">₹1,299</span>
                <button
                  onClick={() => {
                    addToCart({
                      id: 'setup-wristrest',
                      name: 'Ergo-Cloud Memory Foam Wrist Rest',
                      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2I-uABkYoYjL69fsMvG8Iqm9a1FlzTHRJ4CSA7N5lOQLHk_q6exQesz4-o_IrHM-jKZKDCyBnFRlK9gSVHQDi3i4aP7lqYIGyJKutoufRbXE9aqaZLwNBnbup6Kdbnp7HG9MblCSbofjNa9i5Fwh7lzmD60iHdzdXyzgtqhkdK9IbvJ2oPztbKGqqZ_XLU5lNLVpfoXmiQwLV3jbstp3buzeOfppmi6AX8cV-u3aFQU5CeW01wiqjiljaBo9XoY64GGP6YshGMxfQ',
                      price: 1299,
                    });
                  }}
                  className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">add</span> Add
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group">
            <div className="aspect-square rounded-lg overflow-hidden bg-slate-50 mb-4 relative">
              <img
                alt="Coiled USB-C Cable"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCR5nA42Jx9_qQMo6BKjgMP36lKNTfKkHe2Ni2b4_lAcMrw-GdHd3tJdXYV9rf147Unj6ZY1WnlEBSw9_QMSJtMtErRFFda0b3v2xaamEXgabxC3fh4nEDknDdh-Y8IqEtRknwW1-PLrnuVNbkmIra5zEXcbb3vhVSv4u4yE8pzi1dotOVZsnBQ6WGbu03RwKrb8o0msoyGX6ij5lvXmKi_LFf6KolPNvc2319_taDN9vG_zfRjPkghi1Nb0GckIefSxCAQfv2NRMLe"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-sm">
                Aviator Coiled USB-C Cable - Arctic White
              </h3>
              <div className="flex items-center justify-between">
                <span className="font-black text-primary">₹1,899</span>
                <button
                  onClick={() => {
                    addToCart({
                      id: 'setup-cable',
                      name: 'Aviator Coiled USB-C Cable - Arctic White',
                      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCR5nA42Jx9_qQMo6BKjgMP36lKNTfKkHe2Ni2b4_lAcMrw-GdHd3tJdXYV9rf147Unj6ZY1WnlEBSw9_QMSJtMtErRFFda0b3v2xaamEXgabxC3fh4nEDknDdh-Y8IqEtRknwW1-PLrnuVNbkmIra5zEXcbb3vhVSv4u4yE8pzi1dotOVZsnBQ6WGbu03RwKrb8o0msoyGX6ij5lvXmKi_LFf6KolPNvc2319_taDN9vG_zfRjPkghi1Nb0GckIefSxCAQfv2NRMLe',
                      price: 1899,
                    });
                  }}
                  className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">add</span> Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </LazySection>

      {/* Recently Viewed */}
      <LazySection
        skeleton={<RecentlyViewedSkeleton />}
      >
      <section className="mt-20">
        <div className="flex items-center justify-between mb-8 border-b-2 border-primary/10">
          <h2 className="text-2xl font-black border-b-2 border-primary w-fit pb-2 uppercase tracking-tight">
            Recently Viewed
          </h2>
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="p-2 border border-slate-200 rounded-full hover:bg-white transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="p-2 border border-slate-200 rounded-full hover:bg-white transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
        <Swiper
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="!pb-6"
        >
          <SwiperSlide>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <div className="aspect-square relative overflow-hidden bg-slate-50">
                <img
                  alt="Logitech G Pro"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ_zIeK8rpAbTF0WzNinUx6T9OB7J-AmKg5v12wkfx8a-6WCs84R1rmqFYC0430NQss23GuLFowhq8Sai__1hhsiidbFD8NMqY8dOh8YJKkWM_l0CNFaSwm1iEqF8WnJd6KBWDlMxBbK78ZoYsXsGCrR63obBisuS1GUFIxjNntf7wBQCVZ0ksPb9XQGcxGsGfk9HZbC76WTQIa1N6qfYU09a2ZweyTy7qu6rGxa97_yz5bc8G2SpL6Rf2q4ilQT995WtE-vP64KMC"
                />
              </div>
              <div className="p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Wireless Mouse
                </p>
                <h3 className="font-bold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  G Pro Wireless Gaming Mouse
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-black text-primary">₹8,999</span>
                  <div className="flex items-center text-amber-500 text-[10px]">
                    <span className="material-symbols-outlined text-[12px] fill-1">star</span>
                    4.9
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <div className="aspect-square relative overflow-hidden bg-slate-50">
                <img
                  alt="UltraWide Monitor"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPFWRF-fDWjeN53XSN6Ly6r040yxLxLI8PX3Mpq3RxSjycHHjF_nziqJnvRPzqaeSi0g83zNq_UDdcVeLzX4b_vppnMb2CHWYEJ6_tH9kcg01Wl3FIhYVbNKwLRXEwPOWg-DRf1FQgoEPb3Yxe4HIy2neOJwjh2XUXXoPGX83xBePt7dlys856rBlr9rwJC1eJMXfEHMqdeSy7mteTvlzBcW2eJ2e0TsppYtcH-gyf_iRAyOjfGjQ2UjcYw8cp0qGQhC24UugTDKW4"
                />
              </div>
              <div className="p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Monitors
                </p>
                <h3 className="font-bold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  34" Curved Ultrawide OLED Gaming Monitor
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-black text-primary">₹64,999</span>
                  <div className="flex items-center text-amber-500 text-[10px]">
                    <span className="material-symbols-outlined text-[12px] fill-1">star</span>
                    4.8
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <div className="aspect-square relative overflow-hidden bg-slate-50">
                <img
                  alt="Headset"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDM_KC5nxeVvtfzBl3oVUZjxLchqaLeLsvIdAgqAtmoGy-nsreFd3Pj_mkavLqI-3-dPHl8MXXQDelCL89OiV9TufdurrOiPoh2Iy5WNhvXHOODvMI170GadB8niSgVdvaF7KolGV9ee1XJvAE3HcRBozfU7LWCgbM2meBgcsCcbY0fylM-6ygEUf4OyKaMqxFV4sf7jNO9j7NInBVai7HHhfU4l7EobElktkqZLHWZIzljpLRcHg7YxDgrvlx7fZyYag-I6LB-Unt5"
                />
              </div>
              <div className="p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Audio
                </p>
                <h3 className="font-bold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  Quantum 910 Wireless Surround Headset
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-black text-primary">₹18,499</span>
                  <div className="flex items-center text-amber-500 text-[10px]">
                    <span className="material-symbols-outlined text-[12px] fill-1">star</span>
                    4.7
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <div className="aspect-square relative overflow-hidden bg-slate-50">
                <img
                  alt="Webcam"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuANrD2c39RC2z7d8qIQHbUIvDmqMXofIceivPXO9aD5d5964or41aEFeeExwsFi57spiZc2MeynzzHRLzONM5B3vIHdf7JetHDEUsj9B6xSU-cLKZcFNIKNugQMuLwCMvlT6ukQOXGrAAodtA5Z1F-v0abL91na9xniiX5b2jA8OF5-d7dqDpUAsfQs7NL0klyloX35yWyWX_9A-YtGkybyvluGdt2U4_VX35KpHyT1n23vy9h6UDdcKaq6_f7bC7kDA6GlZcEgTNx2"
                />
              </div>
              <div className="p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Streaming
                </p>
                <h3 className="font-bold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  4K Pro Stream Webcam with Auto-Focus
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-black text-primary">₹12,499</span>
                  <div className="flex items-center text-amber-500 text-[10px]">
                    <span className="material-symbols-outlined text-[12px] fill-1">star</span>
                    4.6
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <div className="aspect-square relative overflow-hidden bg-slate-50">
                <img
                  alt="Controller"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA637ssRpK2M3wo1M3cCA0_VRtLf0MX6GLbk4RH_gQgkFlR0Zz2KVLGqRm2IUvaLraAmSWBZbJuUy7kh90K56HLORhPZ9IHLhS5_zC3wGL5wIhz_drvfyzYWFs61sycdEMVxJm5jJrjD8w6rff6YHWfuH1roDMPqZrTteYVGX-C7fpTg26S5X7wiPoCGc7Hrh-We_CJfWZvgiBlrnOCayE5ZC8uXkPXZua8i6-TkXAKJ-WuLqERkKEyhhlDCmdPKfICp4ipWja9RQBe"
                />
              </div>
              <div className="p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Peripherals
                </p>
                <h3 className="font-bold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  Elite Series 2 Wireless Controller
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-black text-primary">₹15,990</span>
                  <div className="flex items-center text-amber-500 text-[10px]">
                    <span className="material-symbols-outlined text-[12px] fill-1">star</span>
                    4.9
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>
      </LazySection>
    </>
  );
}

