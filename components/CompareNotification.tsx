'use client';

import { useRouter } from 'next/navigation';
import { useCompare } from '@/contexts/CompareContext';

export default function CompareNotification() {
  const { compareProducts, clearAll } = useCompare();
  const router = useRouter();

  if (compareProducts.length < 2) {
    return null;
  }

  const handleCompareNow = () => {
    router.push('/compare');
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-2xl bg-primary text-white p-4 rounded-xl shadow-2xl flex items-center justify-between gap-6 border border-white/10 ring-4 ring-black/5 animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex items-center gap-4">
        <div className="flex -space-x-3">
          {compareProducts.slice(0, 2).map((product) => (
            <div
              key={product.id}
              className="w-12 h-12 rounded-lg border-2 border-primary overflow-hidden bg-slate-100"
            >
              <img
                alt={product.name}
                className="w-full h-full object-cover"
                src={product.image}
              />
            </div>
          ))}
        </div>
        <div>
          <p className="text-sm font-bold">
            {compareProducts.length} Product{compareProducts.length > 1 ? 's' : ''} Selected
          </p>
          <p className="text-[10px] text-slate-400">
            Ready to compare specifications
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={clearAll}
          className="text-xs font-semibold hover:text-accent-green transition-colors mr-2"
        >
          Clear all
        </button>
        <button
          onClick={handleCompareNow}
          className="bg-accent-green text-primary px-6 py-2 rounded-lg font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2"
        >
          Compare Now
          <span className="material-symbols-outlined text-sm">compare_arrows</span>
        </button>
      </div>
    </div>
  );
}

