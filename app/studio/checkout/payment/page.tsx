'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import {
  STUDIO_CHECKOUT_FORM_KEY,
  STUDIO_PAYMENT_KEY,
  loadStudioDraft,
  type StudioCheckoutFormData,
  type StudioOrderDraft,
} from '@/lib/studioCheckout';

export default function StudioPaymentPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<StudioOrderDraft | null>(null);
  const [form, setForm] = useState<StudioCheckoutFormData | null>(null);
  const [method, setMethod] = useState('upi');

  useEffect(() => {
    const d = loadStudioDraft();
    let f: StudioCheckoutFormData | null = null;
    try {
      const raw = localStorage.getItem(STUDIO_CHECKOUT_FORM_KEY);
      if (raw) f = JSON.parse(raw);
    } catch {
      /* ignore */
    }

    if (!d) {
      router.replace('/studio');
      return;
    }
    if (!f?.fullName || !f?.email) {
      router.replace('/studio/checkout');
      return;
    }

    setDraft(d);
    setForm(f);
    setReady(true);
  }, [router]);

  if (!ready || !draft || !form) {
    return (
      <>
        <Navbar />
        <main className="max-w-xl mx-auto px-4 py-20 text-center text-slate-500">Loading…</main>
        <Footer />
      </>
    );
  }

  const pay = () => {
    localStorage.setItem(
      STUDIO_PAYMENT_KEY,
      JSON.stringify({
        method,
        finalTotal: draft.total,
      })
    );
    router.push('/studio/checkout/success');
  };

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Studio', href: '/studio' },
            { label: 'Checkout', href: '/studio/checkout' },
            { label: 'Payment' },
          ]}
        />

        <h1 className="text-2xl font-black text-slate-900 mt-4 mb-6">Payment — custom print</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <p className="text-sm font-bold text-slate-700">Pay with UPI (scan or confirm below)</p>
            <div className="flex justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=jiocoder-studio-${draft.total}`}
                alt="Payment QR"
                className="w-48 h-48 object-contain"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'upi', label: 'UPI' },
                { id: 'cod', label: 'Cash on delivery' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-colors ${
                    method === m.id ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4">Order summary</h3>
            <div className="flex gap-3 mb-4">
              <img src={draft.designImageUrl} alt="" className="w-16 h-14 object-cover rounded-lg border" />
              <div className="text-sm">
                <p className="font-semibold">{draft.designImageName}</p>
                <p className="text-slate-500">{draft.size}</p>
                <p className="text-slate-500">Qty {draft.quantity}</p>
              </div>
            </div>
            <div className="flex justify-between text-lg font-black border-t pt-4">
              <span>Total</span>
              <span>₹{draft.total.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">{form.fullName} · {form.mobile}</p>

            <button
              type="button"
              onClick={pay}
              className="w-full mt-6 bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20"
            >
              I’ve paid — complete order ₹{draft.total.toLocaleString('en-IN')}
            </button>
            <Link href="/studio/checkout" className="block text-center text-sm text-slate-500 mt-4">
              ← Edit shipping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
