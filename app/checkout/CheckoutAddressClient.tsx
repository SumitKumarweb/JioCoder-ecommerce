'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

type FormData = {
  fullName: string;
  mobile: string;
  pinCode: string;
  locality: string;
  address: string;
  city: string;
  state: string;
  addressType: string;
  isDefault: boolean;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const INDIAN_STATES = [
  { code: 'AN', name: 'Andaman and Nicobar Islands' },
  { code: 'AP', name: 'Andhra Pradesh' },
  { code: 'AR', name: 'Arunachal Pradesh' },
  { code: 'AS', name: 'Assam' },
  { code: 'BR', name: 'Bihar' },
  { code: 'CH', name: 'Chandigarh' },
  { code: 'CT', name: 'Chhattisgarh' },
  { code: 'DN', name: 'Dadra and Nagar Haveli' },
  { code: 'DD', name: 'Daman and Diu' },
  { code: 'DL', name: 'Delhi' },
  { code: 'GA', name: 'Goa' },
  { code: 'GJ', name: 'Gujarat' },
  { code: 'HR', name: 'Haryana' },
  { code: 'HP', name: 'Himachal Pradesh' },
  { code: 'JK', name: 'Jammu and Kashmir' },
  { code: 'JH', name: 'Jharkhand' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'KL', name: 'Kerala' },
  { code: 'LA', name: 'Ladakh' },
  { code: 'LD', name: 'Lakshadweep' },
  { code: 'MP', name: 'Madhya Pradesh' },
  { code: 'MH', name: 'Maharashtra' },
  { code: 'MN', name: 'Manipur' },
  { code: 'ML', name: 'Meghalaya' },
  { code: 'MZ', name: 'Mizoram' },
  { code: 'NL', name: 'Nagaland' },
  { code: 'OR', name: 'Odisha' },
  { code: 'PY', name: 'Puducherry' },
  { code: 'PB', name: 'Punjab' },
  { code: 'RJ', name: 'Rajasthan' },
  { code: 'SK', name: 'Sikkim' },
  { code: 'TN', name: 'Tamil Nadu' },
  { code: 'TS', name: 'Telangana' },
  { code: 'TR', name: 'Tripura' },
  { code: 'UP', name: 'Uttar Pradesh' },
  { code: 'UK', name: 'Uttarakhand' },
  { code: 'WB', name: 'West Bengal' },
];

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.fullName.trim()) {
    errors.fullName = 'Full name is required';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Enter a valid name';
  }

  if (!data.mobile.trim()) {
    errors.mobile = 'Mobile number is required';
  } else if (!/^\d{10}$/.test(data.mobile.trim())) {
    errors.mobile = 'Enter a valid 10-digit mobile number';
  }

  if (!data.pinCode.trim()) {
    errors.pinCode = 'PIN code is required';
  } else if (!/^\d{6}$/.test(data.pinCode.trim())) {
    errors.pinCode = 'Enter a valid 6-digit PIN code';
  }

  if (!data.address.trim()) {
    errors.address = 'Address is required';
  }

  if (!data.city.trim()) {
    errors.city = 'City is required';
  }

  if (!data.state) {
    errors.state = 'Please select a state';
  }

  return errors;
}

export default function CheckoutAddressClient() {
  const router = useRouter();
  const { cartItems, getSubtotal, getTotalPrice } = useCart();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    mobile: '',
    pinCode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    addressType: 'home',
    isDefault: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const couponInputRef = useRef<HTMLInputElement>(null);

  // Auto-fill from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('checkoutFormData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch { /* ignore */ }
    }
    const userName = localStorage.getItem('userName');
    if (userName) {
      setFormData((prev) => ({ ...prev, fullName: prev.fullName || userName }));
    }
    // Restore applied coupon
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon) {
      try { setAppliedCoupon(JSON.parse(savedCoupon)); } catch { /* ignore */ }
    }
  }, []);

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) { setCouponError('Please enter a coupon code'); return; }
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          cartTotal: subtotal,
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
          description: data.description,
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const fieldName = name as keyof FormData;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [fieldName]: newValue }));
    // Clear error on change
    if (errors[fieldName]) {
      setErrors((prev) => { const e = { ...prev }; delete e[fieldName]; return e; });
    }
  };

  const handleBlur = (name: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validate(formData);
    if (fieldErrors[name]) {
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, addressType: value }));
  };

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Partial<Record<keyof FormData, boolean>>
    );
    setTouched(allTouched);

    const fieldErrors = validate(formData);
    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) {
      // Scroll to first error
      const firstErrorKey = Object.keys(fieldErrors)[0];
      const el = document.querySelector(`[name="${firstErrorKey}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    localStorage.setItem('checkoutFormData', JSON.stringify(formData));
    if (appliedCoupon) {
      localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('appliedCoupon');
    }
    router.push('/checkout/payment');
  };

  const subtotal = getSubtotal();
  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(getTotalPrice() - couponDiscount, 0);

  const inputClass = (field: keyof FormData) =>
    `w-full h-12 px-4 rounded-lg border outline-none transition-all ${
      touched[field] && errors[field]
        ? 'border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-300'
        : 'border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary'
    }`;

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

              <div className="space-y-6">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('fullName')}
                    className={inputClass('fullName')}
                    placeholder="Enter your full name"
                    type="text"
                  />
                  {touched.fullName && errors.fullName && (
                    <p className="text-xs text-rose-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">error</span>
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Mobile & PIN Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                        +91
                      </span>
                      <input
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('mobile')}
                        className={`${inputClass('mobile')} pl-12`}
                        placeholder="9876543210"
                        type="tel"
                        maxLength={10}
                      />
                    </div>
                    {touched.mobile && errors.mobile && (
                      <p className="text-xs text-rose-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">error</span>
                        {errors.mobile}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      PIN Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('pinCode')}
                      className={inputClass('pinCode')}
                      placeholder="6-digit PIN code"
                      type="text"
                      maxLength={6}
                    />
                    {touched.pinCode && errors.pinCode && (
                      <p className="text-xs text-rose-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">error</span>
                        {errors.pinCode}
                      </p>
                    )}
                  </div>
                </div>

                {/* Locality */}
                <div className="space-y-1.5">
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
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Address (Area and Street) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('address')}
                    className={`w-full p-4 rounded-lg border outline-none transition-all resize-none ${
                      touched.address && errors.address
                        ? 'border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-300'
                        : 'border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary'
                    }`}
                    placeholder="Flat / House No. / Building / Company / Apartment"
                    rows={3}
                  />
                  {touched.address && errors.address && (
                    <p className="text-xs text-rose-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">error</span>
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* City & State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      City / District / Town <span className="text-rose-500">*</span>
                    </label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('city')}
                      className={inputClass('city')}
                      placeholder="City"
                      type="text"
                    />
                    {touched.city && errors.city && (
                      <p className="text-xs text-rose-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">error</span>
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      State <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('state')}
                      className={`${inputClass('state')} appearance-none`}
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {touched.state && errors.state && (
                      <p className="text-xs text-rose-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">error</span>
                        {errors.state}
                      </p>
                    )}
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

                <div className="pt-2 flex items-center gap-2">
                  <input
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary accent-primary"
                    id="default-address"
                    type="checkbox"
                  />
                  <label className="text-sm text-slate-600" htmlFor="default-address">
                    Make this my default shipping address
                  </label>
                </div>
              </div>
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
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">{item.name}</h3>
                      {item.variant && <p className="text-xs text-slate-500 mt-1">{item.variant}</p>}
                      <p className="text-sm font-bold text-slate-900 mt-1.5">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon / Voucher */}
              <div className="px-6 pb-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-green-600 text-lg flex-shrink-0">local_offer</span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-green-700 font-mono tracking-wider">{appliedCoupon.code}</p>
                        <p className="text-xs text-green-600 truncate">{appliedCoupon.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-bold text-green-700">
                        -₹{appliedCoupon.discountAmount.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={handleRemoveCoupon}
                        className="p-1 rounded-full hover:bg-green-100 text-green-600 transition-colors"
                        title="Remove coupon"
                      >
                        <span className="material-symbols-outlined text-base">close</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        ref={couponInputRef}
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        className="flex-1 h-10 px-3 rounded-lg border border-slate-200 text-sm font-mono uppercase tracking-wider outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Enter coupon / voucher code"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                        className="h-10 px-4 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {couponLoading ? (
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                          'Apply'
                        )}
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

              {/* Price Breakdown */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Shipping Fee</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">local_offer</span>
                      Coupon ({appliedCoupon.code})
                    </span>
                    <span className="text-green-700 font-bold">-₹{appliedCoupon.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
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
                <button
                  onClick={handleContinue}
                  className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-lg font-bold text-lg shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Continue to Payment
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
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
