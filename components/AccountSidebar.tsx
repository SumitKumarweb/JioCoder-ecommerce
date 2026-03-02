'use client';

import Link from 'next/link';

type AccountSidebarProps = {
  activeKey: 'dashboard' | 'orders' | 'wishlist' | 'addresses' | 'electropay' | 'profile';
};

export default function AccountSidebar({ activeKey }: AccountSidebarProps) {
  const linkClass = (key: AccountSidebarProps['activeKey']) =>
    key === activeKey
      ? 'flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg transition-all'
      : 'flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all group';

  const iconClass = (key: AccountSidebarProps['activeKey']) =>
    key === activeKey ? 'material-symbols-outlined fill-1' : 'material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors';

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
      <div className="px-2 mb-6">
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Account Settings
        </p>
      </div>
      <nav className="space-y-1">
        <Link className={linkClass('dashboard')} href="/profile">
          <span className={iconClass('dashboard')}>grid_view</span>
          <span className="text-sm font-semibold">Dashboard</span>
        </Link>
        <Link className={linkClass('orders')} href="/profile/orders">
          <span className={activeKey === 'orders' ? 'material-symbols-outlined fill-1' : iconClass('orders')}>
            package_2
          </span>
          <span className={`text-sm ${activeKey === 'orders' ? 'font-bold' : 'font-semibold'}`}>Order History</span>
        </Link>
        <Link className={linkClass('wishlist')} href="/profile/wishlist">
          <span className={iconClass('wishlist')}>favorite</span>
          <span className="text-sm font-semibold">My Wishlist</span>
        </Link>
        <Link className={linkClass('addresses')} href="/profile/addresses">
          <span className={iconClass('addresses')}>location_on</span>
          <span className="text-sm font-semibold">Saved Addresses</span>
        </Link>
        <Link className={linkClass('electropay')} href="/profile/electropay">
          <span className={iconClass('electropay')}>account_balance_wallet</span>
          <span className="text-sm font-semibold">ElectroPay Credit</span>
        </Link>
        <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />
        <Link className={linkClass('profile')} href="/profile">
          <span className={iconClass('profile')}>person</span>
          <span className="text-sm font-semibold">Profile Info</span>
        </Link>
        <Link
          className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all group"
          href="#"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm font-semibold">Logout</span>
        </Link>
      </nav>
    </aside>
  );
}
