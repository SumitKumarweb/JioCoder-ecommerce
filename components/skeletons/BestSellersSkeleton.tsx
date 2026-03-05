export default function BestSellersSkeleton() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 bg-slate-200 rounded animate-pulse"></div>
      </div>
      <div className="relative px-0 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-slate-100 animate-pulse">
                <div className="absolute top-3 right-3 w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
              </div>
              <div className="p-5 flex-1 flex flex-col space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-16 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-6 w-full bg-slate-200 rounded animate-pulse"></div>
                  </div>
                  <div className="w-12 h-5 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="w-3 h-3 bg-slate-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                  <div className="h-3 w-16 bg-slate-200 rounded animate-pulse ml-1"></div>
                </div>
                <div className="mt-auto pt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-7 w-24 bg-slate-200 rounded animate-pulse"></div>
                    <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Navigation Arrows Skeleton */}
        <div className="absolute left-0 md:left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-slate-200 rounded-full animate-pulse"></div>
        <div className="absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-slate-200 rounded-full animate-pulse"></div>
      </div>
    </section>
  );
}

