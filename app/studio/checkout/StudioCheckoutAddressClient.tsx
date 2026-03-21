'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import {
  STUDIO_CHECKOUT_FORM_KEY,
  loadStudioDraft,
  type StudioCheckoutFormData,
} from '@/lib/studioCheckout';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
];

const emptyForm: StudioCheckoutFormData = {
  fullName: '',
  email: '',
  mobile: '',
  pinCode: '',
  locality: '',
  address: '',
  city: '',
  state: '',
  addressType: 'home',
};

export default function StudioCheckoutAddressClient() {
  const router = useRouter();
  const [draft, setDraft] = useState(loadStudioDraft);
  const [form, setForm] = useState<StudioCheckoutFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof StudioCheckoutFormData, string>>>({});

  useEffect(() => {
    const d = loadStudioDraft();
    setDraft(d);
    if (!d) return;
    try {
      const saved = localStorage.getItem(STUDIO_CHECKOUT_FORM_KEY);
      if (saved) setForm({ ...emptyForm, ...JSON.parse(saved) });
      const checkout = localStorage.getItem('checkoutFormData');
      if (checkout && !saved) {
        const p = JSON.parse(checkout);
        setForm((prev) => ({
          ...prev,
          fullName: p.fullName || prev.fullName,
          mobile: p.mobile || prev.mobile,
          pinCode: p.pinCode || prev.pinCode,
          locality: p.locality || prev.locality,
          address: p.address || prev.address,
          city: p.city || prev.city,
          state: p.state || prev.state,
          addressType: p.addressType || prev.addressType,
        }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const validate = (f: StudioCheckoutFormData) => {
    const e: Partial<Record<keyof StudioCheckoutFormData, string>> = {};
    if (!f.fullName.trim()) e.fullName = 'Required';
    if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Valid email required';
    if (!f.mobile.trim() || !/^\d{10}$/.test(f.mobile.trim())) e.mobile = 'Valid 10-digit mobile required';
    if (!f.pinCode.trim() || !/^\d{6}$/.test(f.pinCode.trim())) e.pinCode = 'Valid 6-digit PIN required';
    if (!f.address.trim()) e.address = 'Required';
    if (!f.city.trim()) e.city = 'Required';
    if (!f.state.trim()) e.state = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = (ev: React.MouseEvent) => {
    ev.preventDefault();
    if (!draft) {
      router.push('/studio');
      return;
    }
    if (!validate(form)) {
      const first = document.querySelector('[data-studio-field-error="true"]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    localStorage.setItem(STUDIO_CHECKOUT_FORM_KEY, JSON.stringify(form));
    router.push('/studio/checkout/payment');
  };

  if (!draft) {
    return (
      <>
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-black text-slate-900 mb-4">No custom design in checkout</h1>
          <p className="text-slate-600 mb-8">Go back to the studio to upload a design and continue.</p>
          <Link href="/studio" className="inline-flex px-8 py-3 bg-primary text-white font-bold rounded-xl">
            Open Design Studio
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const inputClass = (field: keyof StudioCheckoutFormData) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary ${
      errors[field] ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-white'
    }`;

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Studio', href: '/studio' },
            { label: 'Checkout' },
          ]}
        />

        <h1 className="text-3xl font-black text-slate-900 mt-4 mb-2">Studio checkout — shipping</h1>
        <p className="text-slate-500 text-sm mb-8">Custom print order · {draft.size} · Qty {draft.quantity}</p>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-4">
            {([
              ['fullName', 'Full name', 'text'],
              ['email', 'Email', 'email'],
              ['mobile', 'Mobile (10 digits)', 'tel'],
              ['pinCode', 'PIN code', 'text'],
              ['locality', 'Locality / area (optional)', 'text'],
              ['address', 'Street address', 'text'],
              ['city', 'City', 'text'],
            ] as const).map(([key, label, type]) => (
              <div key={key} data-studio-field-error={errors[key] ? 'true' : undefined}>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">{label}</label>
                <input
                  type={type}
                  className={inputClass(key)}
                  value={form[key]}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, [key]: e.target.value }));
                    setErrors((er) => ({ ...er, [key]: undefined }));
                  }}
                />
                {errors[key] && <p className="text-xs text-rose-600 mt-1">{errors[key]}</p>}
              </div>
            ))}

            <div data-studio-field-error={errors.state ? 'true' : undefined}>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">State</label>
              <select
                className={inputClass('state')}
                value={form.state}
                onChange={(e) => {
                  setForm((p) => ({ ...p, state: e.target.value }));
                  setErrors((er) => ({ ...er, state: undefined }));
                }}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.state && <p className="text-xs text-rose-600 mt-1">{errors.state}</p>}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-28 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex gap-3 mb-4">
                <img
                  src={draft.designImageUrl}
                  alt=""
                  className="w-20 h-16 object-cover rounded-lg border border-slate-200"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{draft.designImageName}</p>
                  <p className="text-xs text-slate-500">{draft.material}</p>
                </div>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-100 pt-4">
                <span className="text-slate-600">Total</span>
                <span className="text-xl font-black text-slate-900">₹{draft.total.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-xs text-primary font-bold uppercase mt-2">Free shipping</p>

              <button
                type="button"
                onClick={handleContinue}
                className="w-full mt-6 bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:opacity-95"
              >
                Continue to payment
              </button>
              <Link href="/studio" className="block text-center text-sm text-slate-500 mt-4 hover:text-primary">
                ← Back to studio
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
