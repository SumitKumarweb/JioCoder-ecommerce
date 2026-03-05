export default function FeaturedCategoriesSkeleton({ count = 5 }: { count?: number }) {
  return (
    <section className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-slate-200 rounded w-48"></div>
        <div className="h-5 bg-slate-200 rounded w-20"></div>
      </div>
      
      {/* Categories grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="text-center space-y-3">
            {/* Image container skeleton */}
            <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 p-4">
              <div className="w-full h-full bg-slate-200 rounded-xl"></div>
            </div>
            {/* Category name skeleton */}
            <div className="h-5 bg-slate-200 rounded w-3/4 mx-auto"></div>
          </div>
        ))}
      </div>
    </section>
  );
}

