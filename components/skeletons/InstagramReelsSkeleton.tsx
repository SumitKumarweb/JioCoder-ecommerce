export default function InstagramReelsSkeleton() {
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <div className="h-8 w-40 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 w-48 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="h-5 w-32 bg-slate-200 rounded animate-pulse"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="relative aspect-[9/16] rounded-xl overflow-hidden bg-slate-100 animate-pulse"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

