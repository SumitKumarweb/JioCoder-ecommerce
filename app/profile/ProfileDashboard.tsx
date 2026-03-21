'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ProfileSection from '@/components/ProfileSection';
import ProfileStats from './ProfileStats';
import {
  LS_USER_AVATAR,
  LS_USER_EMAIL,
  LS_USER_ID,
  LS_USER_NAME,
  LS_SAVED_ADDRESSES,
  defaultAvatarUrl,
} from '@/lib/userLocal';

type OrderItem = { name: string; quantity: number; price: number };
type OrderRow = {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  items: OrderItem[];
  createdAt?: string;
  shippingAddress?: { city?: string; state?: string; address?: string };
};

function readAddressCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(LS_SAVED_ADDRESSES);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr.length;
    }
  } catch {
    /* ignore */
  }
  try {
    const checkout = localStorage.getItem('checkoutFormData');
    if (checkout) {
      const p = JSON.parse(checkout);
      if (p?.address?.trim?.() || p?.city?.trim?.()) return 1;
    }
  } catch {
    /* ignore */
  }
  return 0;
}

function addressSummary(): string {
  if (typeof window === 'undefined') return 'Add at checkout';
  try {
    const raw = localStorage.getItem(LS_SAVED_ADDRESSES);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length > 0) {
        const labels = arr
          .map((a: { label?: string; addressType?: string }) => a.label || a.addressType)
          .filter(Boolean);
        if (labels.length) return labels.slice(0, 2).join(', ');
      }
    }
  } catch {
    /* ignore */
  }
  try {
    const checkout = localStorage.getItem('checkoutFormData');
    if (checkout) {
      const p = JSON.parse(checkout);
      const parts = [p?.city, p?.state].filter(Boolean);
      if (parts.length) return parts.join(', ');
    }
  } catch {
    /* ignore */
  }
  return 'Add at checkout';
}

function statusStep(status: string): 0 | 1 | 2 | 3 | 4 {
  switch (status) {
    case 'PENDING':
      return 1;
    case 'PAID':
      return 2;
    case 'SHIPPED':
      return 3;
    case 'COMPLETED':
      return 4;
    default:
      return 1;
  }
}

function progressWidthPct(status: string): string {
  const s = statusStep(status);
  if (s <= 1) return '0%';
  if (s === 2) return '33%';
  if (s === 3) return '66%';
  return '100%';
}

export default function ProfileDashboard() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string | undefined>();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [addrCount, setAddrCount] = useState(0);
  const [addrHint, setAddrHint] = useState('');

  const syncFromStorage = useCallback(() => {
    setName(localStorage.getItem(LS_USER_NAME)?.trim() || '');
    setEmail(localStorage.getItem(LS_USER_EMAIL)?.trim() || '');
    setAvatar(localStorage.getItem(LS_USER_AVATAR) || undefined);
    setAddrCount(readAddressCount());
    setAddrHint(addressSummary());
  }, []);

  useEffect(() => {
    syncFromStorage();
    const onStorage = () => syncFromStorage();
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [syncFromStorage]);

  useEffect(() => {
    const uid = localStorage.getItem(LS_USER_ID);
    const em = localStorage.getItem(LS_USER_EMAIL)?.trim();
    const qs = uid
      ? `userId=${encodeURIComponent(uid)}`
      : em
        ? `email=${encodeURIComponent(em)}`
        : '';
    if (!qs) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setOrdersLoading(true);
      try {
        const res = await fetch(`/api/orders?${qs}`);
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) setOrders(data as OrderRow[]);
      } catch {
        if (!cancelled) setOrders([]);
      } finally {
        if (!cancelled) setOrdersLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAvatarChange = (dataUrl: string) => {
    try {
      localStorage.setItem(LS_USER_AVATAR, dataUrl);
      setAvatar(dataUrl);
    } catch {
      alert('Image too large for storage. Try a smaller photo.');
    }
  };

  const totalOrders = orders.length;
  const thisMonthCount = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return orders.filter((o) => {
      if (!o.createdAt) return false;
      return new Date(o.createdAt) >= start;
    }).length;
  }, [orders]);

  /** First order date as a friendly “member since” hint (orders-based, not account creation). */
  const memberSince = useMemo(() => {
    if (orders.length === 0) return undefined;
    const oldest = orders.reduce((acc, o) => {
      const t = o.createdAt ? new Date(o.createdAt).getTime() : Infinity;
      const best = acc.createdAt ? new Date(acc.createdAt).getTime() : Infinity;
      return t < best ? o : acc;
    });
    if (!oldest.createdAt) return undefined;
    return new Date(oldest.createdAt).toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric',
    });
  }, [orders]);

  const recent = orders[0];
  const displayName = name || 'Member';
  const displayEmail = email || '';

  const step = recent ? statusStep(recent.status) : 0;
  const isCancelled = recent?.status === 'CANCELLED';

  return (
    <div className="max-w-5xl mx-auto space-y-8 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Account Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your orders, wishlist, and profile.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
          <span className="material-symbols-outlined text-sm">verified</span>
          JioCoder member
        </div>
      </div>

      <ProfileSection
        name={displayName}
        email={displayEmail}
        memberSince={memberSince}
        location={addrHint}
        avatarSrc={avatar || defaultAvatarUrl(displayName)}
        onAvatarChange={handleAvatarChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-xl hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">Total Orders</span>
            <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">shopping_bag</span>
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {ordersLoading ? '…' : String(totalOrders).padStart(2, '0')}
          </p>
          <p className="text-xs text-emerald-500 font-medium mt-1">
            {ordersLoading ? 'Loading…' : thisMonthCount > 0 ? `+${thisMonthCount} this month` : 'No new orders this month'}
          </p>
        </div>

        <ProfileStats />

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-xl hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">Saved Addresses</span>
            <div className="size-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">location_on</span>
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {String(addrCount).padStart(2, '0')}
          </p>
          <Link
            href="/profile/addresses"
            className="text-xs text-primary font-medium mt-1 inline-block hover:underline"
          >
            {addrHint}
          </Link>
        </div>
      </div>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">local_shipping</span>
            Recent Order Status
          </h3>
          <Link className="text-primary text-sm font-bold hover:underline" href="/profile/orders">
            View All Orders
          </Link>
        </div>
        <div className="p-6">
          {ordersLoading ? (
            <p className="text-slate-500 text-sm">Loading your orders…</p>
          ) : !recent ? (
            <div className="text-center py-10">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-3 block">shopping_bag</span>
              <p className="text-slate-600 dark:text-slate-300 font-medium">No orders yet</p>
              <p className="text-sm text-slate-500 mt-1">Shop the store — your tracking will appear here.</p>
              <Link
                href="/products"
                className="inline-flex mt-4 text-sm font-bold text-primary hover:underline"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex gap-4">
                <div className="size-24 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center p-2 shrink-0">
                  {recent.items?.[0] ? (
                    <span className="material-symbols-outlined text-4xl text-slate-400">inventory_2</span>
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-slate-400">package</span>
                  )}
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white truncate">
                    {recent.items?.[0]?.name || 'Order items'}
                    {(recent.items?.length || 0) > 1 && (
                      <span className="text-slate-500 font-normal"> +{recent.items.length - 1} more</span>
                    )}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">#{recent.orderNumber}</p>
                  <p className="text-lg font-black text-primary mt-1">
                    ₹{recent.total.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                {isCancelled ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-800 dark:text-red-200">
                    This order was cancelled.
                  </div>
                ) : (
                  <>
                    <div className="relative mb-6">
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2" />
                      <div
                        className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 transition-all duration-500"
                        style={{ width: progressWidthPct(recent.status) }}
                      />
                      <div className="relative flex justify-between">
                        {[1, 2, 3, 4].map((n) => (
                          <div key={n} className="flex flex-col items-center w-1/4">
                            <div
                              className={`size-4 rounded-full border-4 ring-4 ring-white dark:ring-slate-900 ${
                                step >= n
                                  ? 'bg-primary border-primary/20'
                                  : 'bg-slate-200 dark:bg-slate-700 border-slate-200/20'
                              } ${step === n && n < 4 ? 'flex items-center justify-center' : ''}`}
                            >
                              {step === n && n < 4 ? (
                                <span className="size-1.5 bg-white rounded-full" />
                              ) : null}
                            </div>
                            <span
                              className={`text-[10px] font-bold mt-2 uppercase text-center px-0.5 ${
                                step === n ? 'text-primary' : 'text-slate-500'
                              }`}
                            >
                              {n === 1 && 'Placed'}
                              {n === 2 && 'Paid'}
                              {n === 3 && 'Shipped'}
                              {n === 4 && 'Done'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary text-xl shrink-0">info</span>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        Status: <span className="font-bold text-primary">{recent.status.replace(/_/g, ' ')}</span>
                        {recent.shippingAddress?.city && (
                          <>
                            {' '}
                            · Ship to{' '}
                            <span className="font-semibold">
                              {[recent.shippingAddress.city, recent.shippingAddress.state]
                                .filter(Boolean)
                                .join(', ')}
                            </span>
                          </>
                        )}
                        {recent.createdAt && (
                          <>
                            {' '}
                            · Placed{' '}
                            {new Date(recent.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </>
                        )}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/profile/electropay"
          className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-xl hover:shadow-xl hover:shadow-primary/5 transition-all block"
        >
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <span className="material-symbols-outlined">credit_card</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                Manage Payment Methods
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                ElectroPay credit, UPI and saved options.
              </p>
            </div>
            <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">
              chevron_right
            </span>
          </div>
        </Link>

        <Link
          href="/sale"
          className="group block bg-gradient-to-r from-primary to-blue-700 p-[1px] rounded-xl shadow-lg shadow-primary/10"
        >
          <div className="bg-white dark:bg-slate-900 shadow-sm p-6 rounded-xl h-full flex items-center gap-4">
            <div className="size-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined">workspace_premium</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 dark:text-white">Deals &amp; benefits</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Check current offers and free shipping thresholds.
              </p>
            </div>
            <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">
              chevron_right
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
