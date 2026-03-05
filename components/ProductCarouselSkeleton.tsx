export default function ProductCarouselSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-2">
        <div className="h-6 bg-slate-200 rounded w-48 animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-10 w-10 bg-slate-200 rounded-full animate-pulse"></div>
          <div className="h-10 w-10 bg-slate-200 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Carousel items skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-xl overflow-hidden animate-pulse">
            {/* Image skeleton */}
            <div className="aspect-square bg-slate-200"></div>
            
            {/* Content skeleton */}
            <div className="p-4 space-y-2">
              <div className="h-3 bg-slate-200 rounded w-20"></div>
              <div className="h-5 bg-slate-200 rounded w-full"></div>
              <div className="h-5 bg-slate-200 rounded w-3/4"></div>
              <div className="flex items-center justify-between mt-2">
                <div className="h-6 bg-slate-200 rounded w-24"></div>
                <div className="h-4 bg-slate-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

