export default function BlogCarouselSkeleton() {
  return (
    <section className="mb-12 mt-6">
      <div className="relative h-[500px] w-full overflow-hidden rounded-xl bg-slate-200 animate-pulse">
        {/* Image skeleton */}
        <div className="absolute inset-0 bg-slate-300"></div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        
        {/* Content skeleton */}
        <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-3xl space-y-4">
          {/* Category badge skeleton */}
          <div className="h-6 bg-white/20 rounded-full w-32"></div>
          
          {/* Title skeleton */}
          <div className="space-y-3">
            <div className="h-8 bg-white/20 rounded w-full"></div>
            <div className="h-8 bg-white/20 rounded w-5/6"></div>
          </div>
          
          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-white/20 rounded w-full"></div>
            <div className="h-4 bg-white/20 rounded w-4/5"></div>
          </div>
          
          {/* Button and read time skeleton */}
          <div className="flex items-center gap-4">
            <div className="h-12 bg-white/20 rounded-lg w-32"></div>
            <div className="h-4 bg-white/20 rounded w-24"></div>
          </div>
        </div>
        
        {/* Pagination dots skeleton */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-white/30"></div>
          ))}
        </div>
      </div>
    </section>
  );
}

