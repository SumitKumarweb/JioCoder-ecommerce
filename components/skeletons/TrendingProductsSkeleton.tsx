export default function TrendingProductsSkeleton() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
          <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="min-w-[300px] bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 flex flex-col"
          >
            <div className="relative aspect-square bg-slate-100 animate-pulse">
              <div className="absolute top-3 left-3 w-20 h-5 bg-slate-200 rounded-full animate-pulse"></div>
              <div className="absolute top-3 right-3 w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
            </div>
            <div className="p-4 flex-1 flex flex-col space-y-2">
              <div className="h-5 w-full bg-slate-200 rounded animate-pulse"></div>
              <div className="h-7 w-24 bg-slate-200 rounded animate-pulse"></div>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <div className="w-4 h-4 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

