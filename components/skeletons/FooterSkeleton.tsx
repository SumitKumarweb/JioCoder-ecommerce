export default function FooterSkeleton() {
  return (
    <footer className="bg-primary text-slate-400 pt-10 sm:pt-14 md:pt-16 pb-6 sm:pb-8 mt-8 sm:mt-12">
      <div className="max-w-[1440px] mx-auto w-full min-w-0 px-4 md:px-10 lg:px-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
        {/* Brand Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded animate-pulse"></div>
            <div className="h-6 w-24 bg-white/20 rounded animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-white/10 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse"></div>
          </div>
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-6 h-6 bg-white/20 rounded animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <div className="h-5 w-24 bg-white/20 rounded animate-pulse"></div>
          <ul className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <li key={i}>
                <div className="h-4 w-32 bg-white/10 rounded animate-pulse"></div>
              </li>
            ))}
          </ul>
        </div>

        {/* Policies */}
        <div className="space-y-4">
          <div className="h-5 w-24 bg-white/20 rounded animate-pulse"></div>
          <ul className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <li key={i}>
                <div className="h-4 w-32 bg-white/10 rounded animate-pulse"></div>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <div className="h-5 w-24 bg-white/20 rounded animate-pulse"></div>
          <div className="h-4 w-full bg-white/10 rounded animate-pulse"></div>
          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-white/10 rounded-lg animate-pulse"></div>
            <div className="w-16 h-10 bg-white/20 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="h-4 w-48 bg-white/10 rounded animate-pulse"></div>
        <div className="flex items-center gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-24 h-6 bg-white/10 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </footer>
  );
}

