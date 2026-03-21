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

  const cardBase =
    'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700/90 shadow-[0_1px_3px_rgba(15,23,42,0.06)] dark:shadow-none rounded-xl transition-all duration-200';
  const cardHover = 'hover:shadow-md hover:border-slate-300/90 dark:hover:border-slate-600';
  const iconBox =
    'size-9 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 flex items-center justify-center';

  return (
    <div className="max-w-5xl mx-auto space-y-8 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Account dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
            Orders, wishlist, and profile in one place.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50/90 dark:bg-slate-800/50 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined text-base text-slate-500 dark:text-slate-400">verified_user</span>
          Verified member
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
        <div className={`${cardBase} ${cardHover} p-6`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">Total orders</span>
            <div className={iconBox}>
              <span className="material-symbols-outlined text-xl">shopping_bag</span>
            </div>
          </div>
          <p className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white">
            {ordersLoading ? '…' : String(totalOrders).padStart(2, '0')}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1.5">
            {ordersLoading
              ? 'Loading…'
              : thisMonthCount > 0
                ? (
                    <>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">+{thisMonthCount}</span> this month
                    </>
                  )
                : 'No new orders this month'}
          </p>
        </div>

        <ProfileStats />

        <div className={`${cardBase} ${cardHover} p-6`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">Saved addresses</span>
            <div className={iconBox}>
              <span className="material-symbols-outlined text-xl">location_on</span>
            </div>
          </div>
          <p className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white">
            {String(addrCount).padStart(2, '0')}
          </p>
          <Link
            href="/profile/addresses"
            className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1.5 inline-block hover:text-slate-900 dark:hover:text-slate-200 underline-offset-2 hover:underline"
          >
            {addrHint}
          </Link>
        </div>
      </div>

      <section className={`${cardBase} overflow-hidden`}>
        <div className="px-6 py-4 border-b border-slate-200/90 dark:border-slate-700/90 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between gap-3">
          <h3 className="font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className={`${iconBox} size-8`}>
              <span className="material-symbols-outlined text-lg">local_shipping</span>
            </span>
            Recent order
          </h3>
          <Link
            className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white underline-offset-2 hover:underline shrink-0"
            href="/profile/orders"
          >
            View all
          </Link>
        </div>
        <div className="p-6">
          {ordersLoading ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">Loading your orders…</p>
          ) : !recent ? (
            <div className="text-center py-12 px-4">
              <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 block">
                shopping_bag
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-medium">No orders yet</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                When you place an order, status and tracking will show here.
              </p>
              <Link
                href="/products"
                className="inline-flex mt-5 text-sm font-semibold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex gap-4">
                <div className="size-24 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center justify-center p-2 shrink-0 border border-slate-200/80 dark:border-slate-700/80">
                  {recent.items?.[0] ? (
                    <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-500">inventory_2</span>
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-500">package</span>
                  )}
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                    {recent.items?.[0]?.name || 'Order items'}
                    {(recent.items?.length || 0) > 1 && (
                      <span className="text-slate-500 dark:text-slate-400 font-normal"> +{recent.items.length - 1} more</span>
                    )}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-0.5">#{recent.orderNumber}</p>
                  <p className="text-lg font-semibold tabular-nums text-slate-900 dark:text-white mt-1.5">
                    ₹{recent.total.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                {isCancelled ? (
                  <div className="rounded-lg border border-rose-200/90 dark:border-rose-900/50 bg-rose-50/80 dark:bg-rose-950/30 p-3.5 text-sm text-rose-900 dark:text-rose-200">
                    This order was cancelled.
                  </div>
                ) : (
                  <>
                    <div className="relative mb-6">
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full -translate-y-1/2" />
                      <div
                        className="absolute top-1/2 left-0 h-1 bg-slate-700 dark:bg-slate-300 rounded-full -translate-y-1/2 transition-all duration-500"
                        style={{ width: progressWidthPct(recent.status) }}
                      />
                      <div className="relative flex justify-between">
                        {[1, 2, 3, 4].map((n) => (
                          <div key={n} className="flex flex-col items-center w-1/4">
                            <div
                              className={`size-3.5 rounded-full border-2 ring-4 ring-white dark:ring-slate-900 ${
                                step >= n
                                  ? 'bg-slate-800 dark:bg-slate-200 border-slate-800 dark:border-slate-200'
                                  : 'bg-slate-200 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
                              } ${step === n && n < 4 ? 'ring-slate-300 dark:ring-slate-600' : ''}`}
                            />
                            <span
                              className={`text-[10px] font-semibold mt-2.5 uppercase tracking-wide text-center px-0.5 ${
                                step >= n
                                  ? 'text-slate-800 dark:text-slate-200'
                                  : 'text-slate-400 dark:text-slate-500'
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

                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/90 dark:border-slate-700/90 rounded-lg p-3.5 flex items-start gap-3">
                      <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-xl shrink-0">
                        info
                      </span>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        Status:{' '}
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {recent.status.replace(/_/g, ' ')}
                        </span>
                        {recent.shippingAddress?.city && (
                          <>
                            {' '}
                            · Ship to{' '}
                            <span className="font-medium text-slate-800 dark:text-slate-200">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/profile/electropay" className={`group ${cardBase} ${cardHover} p-6 block`}>
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-2xl">credit_card</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-100 transition-colors">
                Payments &amp; ElectroPay
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Credit balance and payment preferences.
              </p>
            </div>
            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0">
              chevron_right
            </span>
          </div>
        </Link>

        <Link href="/sale" className={`group ${cardBase} ${cardHover} p-6 block border-l-[3px] border-l-slate-800 dark:border-l-slate-200`}>
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-2xl">sell</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 dark:text-white">Offers &amp; sale</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Current deals and shipping offers.
              </p>
            </div>
            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0">
              chevron_right
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
