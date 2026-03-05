export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square rounded-lg bg-slate-200 mb-4"></div>
      
      {/* Content skeleton */}
      <div className="space-y-2">
        {/* Stars skeleton */}
        <div className="flex items-center gap-1 mb-1">
          <div className="h-3 w-16 bg-slate-200 rounded"></div>
        </div>
        
        {/* Title skeleton */}
        <div className="space-y-1">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        </div>
        
        {/* Price skeleton */}
        <div className="h-6 bg-slate-200 rounded w-24"></div>
      </div>
    </div>
  );
}

