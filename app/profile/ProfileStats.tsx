'use client';

import { useWishlist } from '@/contexts/WishlistContext';

export default function ProfileStats() {
  const { wishlistIds, isLoading } = useWishlist();
  const wishlistCount = wishlistIds.length;

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-xl hover:border-primary/50 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">Wishlist Items</span>
          <div className="size-8 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">favorite</span>
          </div>
        </div>
        <p className="text-3xl font-black text-slate-900 dark:text-white">
          {isLoading ? '...' : wishlistCount.toString().padStart(2, '0')}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {wishlistCount === 0 ? 'No items yet' : `${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'} saved`}
        </p>
      </div>
    </>
  );
}

