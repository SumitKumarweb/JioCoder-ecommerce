import ProductGridSkeleton from './ProductGridSkeleton';

export default function CollectionDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 bg-slate-200 rounded w-16 animate-pulse"></div>
        <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
        <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
        <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
        <div className="h-4 bg-slate-200 rounded w-32 animate-pulse"></div>
      </div>

      {/* Hero banner skeleton (if exists) */}
      <div className="w-full h-40 md:h-52 rounded-2xl bg-slate-200 animate-pulse"></div>

      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-slate-200 rounded w-64 animate-pulse"></div>
        <div className="h-5 bg-slate-200 rounded w-96 animate-pulse"></div>
      </div>

      {/* Sort bar skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-200 pb-4">
        <div className="h-4 bg-slate-200 rounded w-48 animate-pulse"></div>
        <div className="h-10 bg-slate-200 rounded w-40 animate-pulse"></div>
      </div>

      {/* Product grid skeleton */}
      <ProductGridSkeleton count={12} />
    </div>
  );
}

