'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

interface AppliedCoupon {
  code: string;
  type: 'PERCENTAGE' | 'FIXED' | 'VOUCHER';
  value: number;
  discountAmount: number;
  description: string;
}

const frequentlyBoughtTogether = [
  {
    id: 'fbt-1',
    name: '60W USB-C Cable',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhahmFC0ookl1aFOTfBA1B0UjMFHbBqJ09EKz8eCl3aWall3y6tm0JgCd4fCPPmrOrxRR_qN8sTcQJNuyOiM5VSlVgPHb_NFQG_BGhFxHnk-JXCzD70QiQ-nUK7i_5FCkJr_WN_O-1AdzyoHVXeWoSxUiPZT53jdE0TO0PQEeZ9yDJNscMCNJ-6povdeEG6sETTTZ4lfega6IAIiAwevSmubHiMe8cYEXQhteRQ2qg9RlQGE2xIRjH6Bmchbo-u_u_SZFyZemXuN3w',
    price: 1499,
  },
  {
    id: 'fbt-2',
    name: 'Memory Foam Rest',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXph35xqYrih7ptKOhlgvuiEzHUovokI0GRuowambrp2WxjrmmFFmDkGq-K_q3Ycno9YipYG4i5RuDyscqvvKG2riYu7wOn0Igi-TKteah8Gj34QA6wh9IDMQFMTwB9xMvmY7NMILFUDGdVS1W_6KFw34iufX1u0TzXhqzmUmuve9UPPzHUIAbqdilpeK7KEeS2AY0legVUTCVL2rWBwgT2qbAV0HN2nb0kTQyLbxk9ik9U-3eb3Njt8k8ImCgydVwye5RY6mCWp4z',
    price: 899,
  },
  {
    id: 'fbt-3',
    name: '20W Fast Adapter',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0c-8kHSyHebDIsJerBAw7fyL0eRCY2OrAyWhlIIdFrOxz0jgmP4J585tadOAft6GGZ8IevVIC1pQJKRy7B2bhLRUiloxeVYmfngy0UeMh3fDBPJjN-29fWaKRXVKmzBdyJze2juk36qzGFnprhsXl3uAGYqSH5ayaCE4yjjZ6gknTARZZZhMTkj_tLgP1lsECnDC1JHMJsT33xoKH3xvNHonQr_Tu1SZuwF1uwwLeWbkM4YxIaawN_WXxYOirv5oVIbVkapzgZnhd',
    price: 1900,
  },
];

export default function CartDrawer() {
  const {
    cartItems,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    getSubtotal,
    getGST,
    getTotalPrice,
    getItemCount,
    addToCart,
    isCartHydrated,
  } = useCart();

  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Trigger animation after render
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Remove from DOM after animation
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Restore coupon from checkout flow (same key as CheckoutAddressClient)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('appliedCoupon');
    if (saved) {
      try {
        setAppliedCoupon(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
  }, []);

  // Clear coupon when cart is emptied (only after cart hydrated from storage)
  useEffect(() => {
    if (!isCartHydrated || cartItems.length > 0) return;
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    if (typeof window !== 'undefined') localStorage.removeItem('appliedCoupon');
  }, [isCartHydrated, cartItems.length]);

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code');
      return;
    }
    if (cartItems.length === 0) {
      setCouponError('Add items to your cart first');
      return;
    }
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
        setCouponError(data.error || 'Invalid coupon');
        setAppliedCoupon(null);
        localStorage.removeItem('appliedCoupon');
      } else {
        const coupon: AppliedCoupon = {
          code: data.code,
          type: data.type,
          value: data.value,
          discountAmount: data.discountAmount,
          description: data.description ?? '',
        };
        setAppliedCoupon(coupon);
        localStorage.setItem('appliedCoupon', JSON.stringify(coupon));
        setCouponInput('');
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
    setCouponInput('');
    setCouponError('');
  };

  const freeShippingGoal = 5000;
  const currentTotal = getSubtotal();
  const remainingForFreeShipping = Math.max(0, freeShippingGoal - currentTotal);
  const progressPercentage = Math.min(100, (currentTotal / freeShippingGoal) * 100);

  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(getTotalPrice() - couponDiscount, 0);

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ease-out ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeCart}
      ></div>

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-[100vw] sm:w-[95vw] sm:max-w-[450px] bg-white z-50 shadow-2xl flex flex-col border-l border-slate-200 transition-transform duration-300 ease-out ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-primary">Your Cart</h2>
            <p className="text-sm text-slate-500 font-medium">
              {getItemCount()} {getItemCount() === 1 ? 'item' : 'items'} selected
            </p>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-slate-500">close</span>
          </button>
        </div>

        {/* Free Shipping Progress */}
        {remainingForFreeShipping > 0 && (
          <div className="px-6 py-4 bg-slate-50/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Free Shipping Goal
              </span>
              <span className="text-xs font-bold text-primary">
                ₹{remainingForFreeShipping.toLocaleString('en-IN')} to go
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-[11px] mt-2 text-slate-400 italic">
              Add items worth ₹{remainingForFreeShipping.toLocaleString('en-IN')} more for free delivery across India.
            </p>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
                  shopping_cart
                </span>
                <p className="text-slate-500 font-medium">Your cart is empty</p>
                <p className="text-sm text-slate-400 mt-2">Add items to get started</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="h-24 w-24 bg-slate-50 rounded-lg flex-shrink-0 border border-slate-100 overflow-hidden">
                    <img
                      alt={item.name}
                      className="h-full w-full object-contain p-2"
                      src={item.image}
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-primary text-sm">
                          {item.name}
                        </h3>
                        {item.variant && (
                          <p className="text-xs text-slate-500">{item.variant}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined !text-xl">delete</span>
                      </button>
                    </div>
                    <div className="mt-auto flex justify-between items-center">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden h-8 bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 hover:bg-slate-50 text-slate-600 transition-colors"
                        >
                          <span className="material-symbols-outlined !text-sm">remove</span>
                        </button>
                        <span className="px-3 text-xs font-bold text-primary border-x border-slate-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 hover:bg-slate-50 text-slate-600 transition-colors"
                        >
                          <span className="material-symbols-outlined !text-sm">add</span>
                        </button>
                      </div>
                      <span className="font-bold text-sm text-primary">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Frequently Bought Together */}
          {cartItems.length > 0 && (
            <div className="px-6 py-8 bg-slate-50/30 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                Frequently Bought Together
              </h3>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {frequentlyBoughtTogether.map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-32 bg-white rounded-xl border border-slate-200 p-2 relative group shadow-sm"
                  >
                    <div className="aspect-square bg-slate-50 rounded-lg mb-2 overflow-hidden">
                      <img
                        alt={product.name}
                        className="w-full h-full object-contain p-1"
                        src={product.image}
                      />
                    </div>
                    <h4 className="text-[11px] font-semibold text-primary truncate leading-tight">
                      {product.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                    <button
                      onClick={() =>
                        addToCart({
                          id: product.id,
                          name: product.name,
                          image: product.image,
                          price: product.price,
                        })
                      }
                      className="absolute top-1 right-1 bg-primary text-white size-6 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    >
                      <span className="material-symbols-outlined !text-sm">add</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white">
          {cartItems.length > 0 && (
            <div className="mb-6">
              {appliedCoupon ? (
                <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50/80 px-3 py-2.5">
                  <span className="material-symbols-outlined text-green-600 !text-xl shrink-0 mt-0.5">
                    verified
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-green-800 font-mono tracking-wide">
                      {appliedCoupon.code}
                    </p>
                    <p className="text-xs text-green-700 truncate">{appliedCoupon.description}</p>
                    <p className="text-xs font-bold text-green-800 mt-1">
                      −₹{appliedCoupon.discountAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="shrink-0 p-1 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                    title="Remove coupon"
                  >
                    <span className="material-symbols-outlined !text-lg">close</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 !text-lg text-slate-400">
                        confirmation_number
                      </span>
                      <input
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          setCouponError('');
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 outline-none transition-all"
                        placeholder="Coupon / Gift Voucher"
                        type="text"
                        disabled={couponLoading}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponInput.trim()}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:pointer-events-none text-primary font-bold text-sm rounded-lg transition-colors"
                    >
                      {couponLoading ? '…' : 'Apply'}
                    </button>
                  </div>
                  {couponError && (
                    <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                      <span className="material-symbols-outlined !text-sm">error</span>
                      {couponError}
                    </p>
                  )}
                </>
              )}
            </div>
          )}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span>₹{getSubtotal().toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Estimated GST (18%)</span>
              <span>₹{getGST().toLocaleString('en-IN')}</span>
            </div>
            {appliedCoupon && cartItems.length > 0 && (
              <div className="flex justify-between text-sm text-green-700 font-medium">
                <span>Coupon ({appliedCoupon.code})</span>
                <span>−₹{appliedCoupon.discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-primary pt-2 border-t border-slate-50">
              <span>Total Amount</span>
              <span>
                ₹
                {(cartItems.length > 0 ? finalTotal : 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <Link
            href="/checkout"
            onClick={closeCart}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-primary/10"
          >
            <span>Proceed to Checkout</span>
            <span className="material-symbols-outlined !text-lg">arrow_forward</span>
          </Link>
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
            <span className="material-symbols-outlined !text-xs">verified_user</span>
            Secure Checkout by JioCoder
          </div>
        </div>
      </div>
    </>
  );
}

