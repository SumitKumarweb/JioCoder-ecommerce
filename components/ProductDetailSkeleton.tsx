export default function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 animate-pulse">
      {/* Product Image Skeleton */}
      <div className="lg:col-span-7">
        <div className="aspect-[4/3] rounded-xl bg-slate-200"></div>
      </div>

      {/* Product Info Skeleton */}
      <div className="lg:col-span-5 space-y-6">
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-8 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>

        {/* Price card skeleton */}
        <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-xl space-y-4">
          <div className="h-10 bg-slate-200 rounded w-32"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-32"></div>
            <div className="flex gap-2">
              <div className="flex-1 h-10 bg-slate-200 rounded"></div>
              <div className="h-10 bg-slate-200 rounded w-20"></div>
            </div>
          </div>
        </div>

        {/* Switch type skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 rounded w-24"></div>
          <div className="flex gap-3">
            <div className="h-10 bg-slate-200 rounded w-32"></div>
            <div className="h-10 bg-slate-200 rounded w-32"></div>
            <div className="h-10 bg-slate-200 rounded w-32"></div>
          </div>
        </div>

        {/* Quantity skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 rounded w-20"></div>
          <div className="h-10 bg-slate-200 rounded w-32"></div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 h-12 bg-slate-200 rounded-xl"></div>
          <div className="flex-1 h-12 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

