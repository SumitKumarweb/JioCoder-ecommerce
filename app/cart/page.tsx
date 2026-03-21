'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { useCart } from '@/contexts/CartContext';

interface AppliedCoupon {
  code: string;
  type: 'PERCENTAGE' | 'FIXED' | 'VOUCHER';
  value: number;
  discountAmount: number;
  description: string;
}

interface SuggestedProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  slug: string;
}

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, addToCart, getSubtotal, getGST, getTotalPrice } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [suggestedProducts, setSuggestedProducts] = useState<SuggestedProduct[]>([]);
  const [suggestedLoading, setSuggestedLoading] = useState(true);

  // Restore any previously applied coupon from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('appliedCoupon');
    if (saved) {
      try { setAppliedCoupon(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  // Fetch real products for "You May Also Like", excluding items already in cart
  useEffect(() => {
    const fetchSuggested = async () => {
      setSuggestedLoading(true);
      try {
        const res = await fetch('/api/products?inStock=true');
        if (!res.ok) return;
        const data = await res.json();
        const cartIds = new Set(cartItems.map((i) => i.id));
        // Filter out products already in cart, shuffle, take 3
        const filtered: SuggestedProduct[] = (Array.isArray(data) ? data : [])
          .filter((p: any) => p.image && !cartIds.has(p.slug || p._id?.toString()))
          .map((p: any) => ({
            id: p.slug || String(p._id),
            name: p.name,
            image: p.image,
            price: p.price,
            slug: p.slug || String(p._id),
          }))
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        setSuggestedProducts(filtered);
      } catch {
        setSuggestedProducts([]);
      } finally {
        setSuggestedLoading(false);
      }
    };
    fetchSuggested();
  }, [cartItems]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleApplyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) { setCouponError('Please enter a coupon code'); return; }
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          cartTotal: getSubtotal(),
          cartItemIds: cartItems.map((i) => i.id),
        }),
      });
      const data = await res.json();
      if (!data.valid) {
        setCouponError(data.error || 'Invalid coupon code');
        setAppliedCoupon(null);
        localStorage.removeItem('appliedCoupon');
      } else {
        const coupon: AppliedCoupon = {
          code: data.code,
          type: data.type,
          value: data.value,
          discountAmount: data.discountAmount,
          description: data.description,
        };
        setAppliedCoupon(coupon);
        localStorage.setItem('appliedCoupon', JSON.stringify(coupon));
        setPromoCode('');
        setCouponError('');
      }
    } catch {
      setCouponError('Failed to apply coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem('appliedCoupon');
    setCouponError('');
  };

  const subtotal = getSubtotal();
  const gst = getGST();
  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = Math.max(getTotalPrice() - couponDiscount, 0);

  // If cart is empty, show empty state
  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Shopping Cart' },
            ]}
          />
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-8 p-8 rounded-full bg-slate-100">
              <span className="material-symbols-outlined text-8xl text-slate-300">shopping_cart</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3">Your cart is empty</h2>
            <p className="text-slate-600 max-w-lg mx-auto mb-8">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              href="/products"
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              Browse Products
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shopping Cart' },
          ]}
        />

        <h2 className="text-3xl font-black text-slate-900 mb-8">
          Your Shopping Cart
          <span className="text-slate-400 font-normal text-xl ml-2">({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
        </h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Cart Items (70%) */}
          <div className="lg:w-[70%] space-y-6">
            {/* Cart Items */}
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row gap-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-full sm:w-40 h-40 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                  <img className="w-full h-full object-cover" alt={item.name} src={item.image} />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <Link href={`/product/${item.id}`}>
                        <h3 className="text-lg font-bold text-slate-900 hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-lg font-black text-slate-900 tracking-tight">
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    {item.variant && (
                      <p className="text-sm text-slate-500 mb-4">{item.variant}</p>
                    )}
                    <div className="flex items-center gap-6">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">remove</span>
                        </button>
                        <input
                          className="w-10 text-center bg-transparent border-none focus:ring-0 font-bold text-sm"
                          type="text"
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg text-primary">add</span>
                        </button>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex items-center gap-4 text-sm font-medium">
                        <button className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-lg">favorite</span>
                          <span>Wishlist</span>
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* You May Also Like — dynamic from DB */}
            {(suggestedLoading || suggestedProducts.length > 0) && (
              <div className="mt-12">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">auto_awesome</span>
                  You May Also Like
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {suggestedLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white p-4 border border-slate-200 rounded-xl animate-pulse">
                          <div className="w-full h-32 bg-slate-200 rounded-lg mb-3" />
                          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                          <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
                          <div className="h-9 bg-slate-200 rounded-lg" />
                        </div>
                      ))
                    : suggestedProducts.map((product) => (
                        <div key={product.id} className="bg-white p-4 border border-slate-200 rounded-xl">
                          <Link href={`/product/${product.slug}`}>
                            <img
                              className="w-full h-32 object-cover rounded-lg mb-3 hover:opacity-90 transition-opacity"
                              alt={product.name}
                              src={product.image}
                            />
                          </Link>
                          <Link href={`/product/${product.slug}`}>
                            <h4 className="text-sm font-bold truncate hover:text-primary transition-colors">{product.name}</h4>
                          </Link>
                          <p className="text-sm font-bold text-primary mb-3">₹{product.price.toLocaleString('en-IN')}</p>
                          <button
                            onClick={() => addToCart({
                              id: product.id,
                              name: product.name,
                              image: product.image,
                              price: product.price,
                            }, false)}
                            className="w-full py-2 bg-primary/10 text-slate-900 hover:bg-primary hover:text-white transition-all rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-base">add</span>
                            Add to Cart
                          </button>
                        </div>
                      ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary (30%) */}
          <div className="lg:w-[30%]">
            <div className="sticky top-24 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>

              {/* Costs */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <div className="flex items-center gap-1">
                    <span>GST (18%)</span>
                    <span
                      className="material-symbols-outlined text-xs cursor-help"
                      title="Standard Indian Goods and Service Tax"
                    >
                      info
                    </span>
                  </div>
                  <span className="text-slate-900 font-medium">₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-primary font-bold uppercase text-xs tracking-wider">Free</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mb-6 pt-6 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                  Promo / Voucher Code
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-green-600 text-lg flex-shrink-0">local_offer</span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-green-700 font-mono tracking-wider">{appliedCoupon.code}</p>
                        <p className="text-xs text-green-600 truncate">-₹{appliedCoupon.discountAmount.toLocaleString('en-IN')} off</p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="p-1 rounded-full hover:bg-green-100 text-green-600 transition-colors flex-shrink-0"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono uppercase tracking-wider focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        placeholder="Enter coupon code"
                        type="text"
                        value={promoCode}
                        onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setCouponError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                      />
                      <button
                        onClick={handleApplyPromo}
                        disabled={couponLoading || !promoCode.trim()}
                        className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {couponLoading ? (
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-rose-600 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">error</span>
                        {couponError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Coupon Savings Row */}
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-green-700 font-medium mb-4 -mt-2">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">local_offer</span>
                    Coupon Discount
                  </span>
                  <span className="font-bold">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {/* Total */}
              <div className="pt-6 border-t border-slate-100 mb-8">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-sm text-slate-500 font-medium">Total Payable</span>
                    <p className="text-xs text-slate-400">Incl. of all taxes</p>
                  </div>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/checkout"
                className="w-full bg-primary py-4 rounded-xl text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 flex flex-wrap justify-center gap-4 grayscale opacity-50">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tight">
                  <span className="material-symbols-outlined text-sm">security</span>
                  100% Secure
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tight">
                  <span className="material-symbols-outlined text-sm">published_with_changes</span>
                  Easy Returns
                </div>
              </div>
            </div>

            {/* Shipping Message */}
            <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-xl flex gap-3">
              <span className="material-symbols-outlined text-primary">local_shipping</span>
              <div className="text-xs">
                <p className="font-bold text-slate-900 mb-0.5">Express Delivery Eligible</p>
                <p className="text-slate-600">
                  Order in the next 4 hours for guaranteed shipping by tomorrow morning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

