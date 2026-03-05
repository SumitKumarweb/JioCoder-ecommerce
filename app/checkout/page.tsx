'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { useCart } from '@/contexts/CartContext';

export default function CheckoutPage() {
  const { cartItems, getSubtotal, getGST, getTotalPrice } = useCart();
  const [formData, setFormData] = useState({
    fullName: 'Arjun Malhotra',
    mobile: '',
    pinCode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    addressType: 'home',
    isDefault: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, addressType: value }));
  };

  const subtotal = getSubtotal();
  const gst = getGST();
  const total = getTotalPrice();
  const discount = 2000; // Example discount
  const finalTotal = total - discount;

  // Redirect to cart if empty
  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-8 p-8 rounded-full bg-slate-100">
              <span className="material-symbols-outlined text-8xl text-slate-300">shopping_cart</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3">Your cart is empty</h2>
            <p className="text-slate-600 max-w-lg mx-auto mb-8">
              Please add items to your cart before proceeding to checkout.
            </p>
            <Link
              href="/cart"
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              Go to Cart
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Cart', href: '/cart' },
            { label: 'Checkout' },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
          {/* Left Column: Shipping Form */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Shipping Address</h1>
                <span className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider">
                  Step 1 of 3
                </span>
              </div>
              <form className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="Enter your full name"
                    type="text"
                  />
                </div>

                {/* Mobile & PIN Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Mobile Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                        +91
                      </span>
                      <input
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className="w-full h-12 pl-12 pr-4 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        placeholder="9876543210"
                        type="tel"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">PIN Code</label>
                    <input
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      placeholder="6-digit PIN code"
                      type="text"
                      maxLength={6}
                    />
                  </div>
                </div>

                {/* Locality */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Locality</label>
                  <input
                    name="locality"
                    value={formData.locality}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="e.g. Near HDFC Bank"
                    type="text"
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Address (Area and Street)</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-4 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                    placeholder="Flat / House No. / Building / Company / Apartment"
                    rows={3}
                  />
                </div>

                {/* City & State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">City / District / Town</label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      placeholder="City"
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">State</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none"
                    >
                      <option value="">Select State</option>
                      <option value="MH">Maharashtra</option>
                      <option value="DL">Delhi</option>
                      <option value="KA">Karnataka</option>
                      <option value="TN">Tamil Nadu</option>
                      <option value="TS">Telangana</option>
                      <option value="GJ">Gujarat</option>
                      <option value="RJ">Rajasthan</option>
                      <option value="UP">Uttar Pradesh</option>
                      <option value="WB">West Bengal</option>
                    </select>
                  </div>
                </div>

                {/* Address Type */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">Address Type</label>
                  <div className="flex gap-4">
                    <label className="flex-1 cursor-pointer">
                      <input
                        className="hidden peer"
                        name="addressType"
                        type="radio"
                        checked={formData.addressType === 'home'}
                        onChange={() => handleRadioChange('home')}
                      />
                      <div className="flex items-center justify-center gap-2 h-12 rounded-lg border border-slate-200 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all">
                        <span className="material-symbols-outlined text-xl">home</span>
                        <span className="text-sm font-semibold">Home</span>
                      </div>
                    </label>
                    <label className="flex-1 cursor-pointer">
                      <input
                        className="hidden peer"
                        name="addressType"
                        type="radio"
                        checked={formData.addressType === 'work'}
                        onChange={() => handleRadioChange('work')}
                      />
                      <div className="flex items-center justify-center gap-2 h-12 rounded-lg border border-slate-200 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all">
                        <span className="material-symbols-outlined text-xl">work</span>
                        <span className="text-sm font-semibold">Work</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-2">
                  <input
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                    id="default-address"
                    type="checkbox"
                  />
                  <label className="text-sm text-slate-600" htmlFor="default-address">
                    Make this my default shipping address
                  </label>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
              </div>

              {/* Product List */}
              <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 bg-slate-100 rounded-lg flex-shrink-0">
                      <img
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                        src={item.image}
                      />
                      <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-slate-800 line-clamp-1">{item.name}</h3>
                      {item.variant && <p className="text-xs text-slate-500 mt-1">{item.variant}</p>}
                      <p className="text-sm font-bold text-slate-900 mt-2">
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="px-6 py-4 bg-slate-50 space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Shipping Fee</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Discount (WELCOME10)</span>
                  <span className="text-primary font-medium">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-end">
                  <span className="text-base font-bold text-slate-900">Total Amount</span>
                  <div className="text-right">
                    <p className="text-2xl font-black text-primary">₹{finalTotal.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-slate-400">Inclusive of all taxes</p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 space-y-4">
                <Link
                  href="/checkout/payment"
                  onClick={() => {
                    // Save checkout form data to localStorage
                    localStorage.setItem('checkoutFormData', JSON.stringify(formData));
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-lg font-bold text-lg shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Continue to Payment
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <div className="flex items-center justify-center gap-4 py-2 opacity-60">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    <span className="text-[10px] uppercase font-bold tracking-tighter">Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <span className="text-[10px] uppercase font-bold tracking-tighter">SSL Encrypted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Link */}
            <div className="mt-4 text-center">
              <Link
                href="/cart"
                className="text-sm font-medium text-slate-500 hover:text-primary transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Back to Shopping Cart
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

