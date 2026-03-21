'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  loadStudioDraft,
  clearStudioCheckoutStorage,
  STUDIO_CHECKOUT_FORM_KEY,
  STUDIO_PAYMENT_KEY,
  type StudioCheckoutFormData,
  type StudioOrderDraft,
} from '@/lib/studioCheckout';

export default function StudioCheckoutSuccessPage() {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const run = async () => {
      const draft = loadStudioDraft();
      let formStr: string | null = null;
      let payStr: string | null = null;
      try {
        formStr = localStorage.getItem(STUDIO_CHECKOUT_FORM_KEY);
        payStr = localStorage.getItem(STUDIO_PAYMENT_KEY);
      } catch {
        /* ignore */
      }

      if (!draft || !formStr || !payStr) {
        setStatus('error');
        setMessage('Missing checkout data. Start again from the studio.');
        return;
      }

      let form: StudioCheckoutFormData;
      try {
        form = JSON.parse(formStr);
      } catch {
        setStatus('error');
        setMessage('Invalid form data.');
        return;
      }

      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

      try {
        const res = await fetch('/api/studio/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: form.fullName,
            customerEmail: form.email,
            customerPhone: form.mobile,
            userId: userId || undefined,
            designImageUrl: draft.designImageUrl,
            designImageName: draft.designImageName,
            size: draft.size,
            material: draft.material,
            overlayText: draft.overlayText || undefined,
            overlayFont: draft.overlayFont,
            overlayColor: draft.overlayColor,
            price: draft.price,
            quantity: draft.quantity,
            total: draft.total,
            shippingAddress: {
              address: form.address,
              locality: form.locality,
              city: form.city,
              state: form.state,
              pin: form.pinCode,
              addressType: form.addressType,
            },
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to create order');
        setOrderNumber(data.orderNumber);
        clearStudioCheckoutStorage();
        setStatus('ok');
      } catch (e: unknown) {
        console.error(e);
        setStatus('error');
        setMessage(e instanceof Error ? e.message : 'Something went wrong');
      }
    };
    run();
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        {status === 'loading' && (
          <>
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Placing your custom print order…</p>
          </>
        )}
        {status === 'ok' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">Order placed</h1>
            <p className="text-slate-600 mb-2">Your custom print order is confirmed.</p>
            <p className="font-mono font-bold text-primary text-lg mb-8">{orderNumber}</p>
            <p className="text-sm text-slate-500 mb-8">We’ll email you updates. Printing ships in 3–5 business days.</p>
            <Link href="/studio" className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-xl">
              Back to studio
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="text-2xl font-black text-slate-900 mb-2">Couldn’t complete order</h1>
            <p className="text-rose-600 mb-8">{message}</p>
            <Link href="/studio" className="inline-block px-8 py-3 bg-slate-900 text-white font-bold rounded-xl mr-2">
              Studio
            </Link>
            <Link href="/studio/checkout" className="inline-block px-8 py-3 border border-slate-300 font-bold rounded-xl">
              Checkout again
            </Link>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
