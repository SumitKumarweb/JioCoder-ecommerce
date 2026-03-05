export default function HeroSkeleton() {
  return (
    <section className="relative rounded-lg sm:rounded-xl overflow-hidden bg-primary min-h-[280px] h-[320px] sm:min-h-[380px] sm:h-[420px] md:h-[460px] lg:h-[480px] animate-pulse">
      <div className="absolute inset-0 bg-slate-300"></div>
      <div className="relative z-10 px-4 sm:px-6 md:px-10 lg:px-24 max-w-2xl flex flex-col justify-center h-full space-y-4 sm:space-y-6">
        {/* Tag skeleton */}
        <div className="h-6 bg-white/20 rounded w-24"></div>
        
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-8 sm:h-10 md:h-12 lg:h-14 bg-white/20 rounded w-full"></div>
          <div className="h-8 sm:h-10 md:h-12 lg:h-14 bg-white/20 rounded w-3/4"></div>
        </div>
        
        {/* Subtitle skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-white/20 rounded w-full"></div>
          <div className="h-4 bg-white/20 rounded w-5/6"></div>
        </div>
        
        {/* Button skeleton */}
        <div className="h-12 bg-white/20 rounded-lg w-40"></div>
      </div>
      
      {/* Pagination dots skeleton */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-white/30"></div>
        ))}
      </div>
    </section>
  );
}

