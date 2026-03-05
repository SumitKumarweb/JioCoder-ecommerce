export default function CollectionCardSkeleton() {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 animate-pulse">
      {/* Image skeleton */}
      <div className="relative aspect-video bg-gray-200"></div>
      
      {/* Content skeleton */}
      <div className="p-6">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        
        {/* Description skeleton */}
        <div className="space-y-1 mb-4">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
        
        {/* Link skeleton */}
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );
}

