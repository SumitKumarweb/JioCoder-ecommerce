'use client';

import { useWishlist } from '@/contexts/WishlistContext';

export default function ProfileStats() {
  const { wishlistIds, isLoading } = useWishlist();
  const wishlistCount = wishlistIds.length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700/90 shadow-[0_1px_3px_rgba(15,23,42,0.06)] dark:shadow-none p-6 rounded-xl hover:shadow-md hover:border-slate-300/90 dark:hover:border-slate-600 transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">Wishlist</span>
        <div className="size-9 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 flex items-center justify-center">
          <span className="material-symbols-outlined text-xl">favorite</span>
        </div>
      </div>
      <p className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white">
        {isLoading ? '…' : wishlistCount.toString().padStart(2, '0')}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1.5">
        {wishlistCount === 0 ? 'No items saved' : `${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'} saved`}
      </p>
    </div>
  );
}

