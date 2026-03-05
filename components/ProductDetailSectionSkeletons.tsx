export function TechnicalSpecsSkeleton() {
  return (
    <section className="mt-20 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-64 mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="h-6 bg-slate-200 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between py-2 border-b border-slate-50">
                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                  <div className="h-4 bg-slate-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="h-6 bg-slate-200 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between py-2 border-b border-slate-50">
                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                  <div className="h-4 bg-slate-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FAQSkeleton() {
  return (
    <section className="mt-20 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="h-8 bg-slate-200 rounded w-64"></div>
        <div className="h-4 bg-slate-200 rounded w-64"></div>
      </div>
      <div className="max-w-4xl space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-5">
              <div className="h-6 bg-slate-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <div className="h-4 bg-slate-200 rounded w-48"></div>
      </div>
    </section>
  );
}

export function ReviewsSkeleton() {
  return (
    <section className="mt-20 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-64 mb-8"></div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
        <div className="lg:col-span-4 p-8 bg-white border border-slate-200 rounded-xl h-fit">
          <div className="text-center mb-8">
            <div className="h-16 bg-slate-200 rounded w-24 mx-auto mb-2"></div>
            <div className="h-6 bg-slate-200 rounded w-32 mx-auto mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-40 mx-auto"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 text-sm">
                <div className="h-4 bg-slate-200 rounded w-12"></div>
                <div className="flex-1 h-2 bg-slate-200 rounded-full"></div>
                <div className="h-4 bg-slate-200 rounded w-10"></div>
              </div>
            ))}
          </div>
          <div className="h-10 bg-slate-200 rounded-lg w-full mt-8"></div>
        </div>
        <div className="lg:col-span-8 space-y-8">
          {[1, 2].map((i) => (
            <div key={i} className="pb-8 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                  <div>
                    <div className="h-4 bg-slate-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-slate-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="h-3 bg-slate-200 rounded w-16"></div>
              </div>
              <div className="h-4 bg-slate-200 rounded w-20 mb-3"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-16 w-16 rounded-lg bg-slate-200"></div>
                <div className="h-16 w-16 rounded-lg bg-slate-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CompleteSetupSkeleton() {
  return (
    <section className="mt-20 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-64 mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="aspect-square rounded-lg bg-slate-200 mb-4"></div>
            <div className="space-y-2">
              <div className="h-5 bg-slate-200 rounded w-full"></div>
              <div className="flex items-center justify-between">
                <div className="h-6 bg-slate-200 rounded w-20"></div>
                <div className="h-8 bg-slate-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RecentlyViewedSkeleton() {
  return (
    <section className="mt-20 animate-pulse">
      <div className="flex items-center justify-between mb-8 border-b-2 border-primary/10">
        <div className="h-8 bg-slate-200 rounded w-48"></div>
        <div className="flex gap-2 mb-2">
          <div className="h-10 w-10 rounded-full bg-slate-200"></div>
          <div className="h-10 w-10 rounded-full bg-slate-200"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="aspect-square bg-slate-200"></div>
            <div className="p-4">
              <div className="h-3 bg-slate-200 rounded w-24 mb-1"></div>
              <div className="h-5 bg-slate-200 rounded w-full mb-2"></div>
              <div className="flex items-center justify-between">
                <div className="h-6 bg-slate-200 rounded w-20"></div>
                <div className="h-4 bg-slate-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

