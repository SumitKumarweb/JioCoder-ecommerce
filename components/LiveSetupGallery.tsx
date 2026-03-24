'use client';

import { useEffect, useState } from 'react';
import { useInViewOnce } from '@/hooks/useInViewOnce';
import { useHomepageFetchQueue } from '@/components/home/HomepageFetchQueue';

interface GalleryItem {
  _id: string;
  image: string;
  title?: string;
  description?: string;
  url?: string;
}

export default function LiveSetupGallery() {
  const { wrapperRef, shouldLoad } = useInViewOnce();
  const enqueue = useHomepageFetchQueue();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!shouldLoad) return;
    const ac = new AbortController();
    let cancelled = false;
    setIsLoading(true);

    enqueue(async () => {
      try {
        const res = await fetch('/api/live-gallery', { signal: ac.signal });
        if (!res.ok) {
          throw new Error(`Failed to fetch gallery items: ${res.status}`);
        }
        const data: GalleryItem[] = await res.json();
        if (!cancelled && !ac.signal.aborted) {
          setItems(data || []);
        }
      } catch (error) {
        if (ac.signal.aborted || cancelled) return;
        console.error('Failed to load live gallery items from API', error);
      } finally {
        if (!cancelled && !ac.signal.aborted) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [shouldLoad, enqueue]);

  const placeholder = (
    <div
      className="min-h-[200px] rounded-2xl bg-slate-800/25 border border-white/5 animate-pulse"
      aria-hidden
    />
  );

  return (
    <div ref={wrapperRef} className="min-w-0">
      {!shouldLoad && placeholder}
      {shouldLoad && isLoading && placeholder}
      {shouldLoad && !isLoading && items.length > 0 ? (
        <section className="space-y-8">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">Live Setup Gallery</h3>
              <p className="text-slate-400">Hover to see these battle-stations in action.</p>
            </div>
            <button
              type="button"
              className="text-accent-green font-bold text-sm flex items-center gap-1 hover:underline"
            >
              Share Yours
              <span className="material-symbols-outlined text-sm">upload</span>
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="gallery-item relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer bg-slate-800 border border-white/5"
                onMouseEnter={() => setHoveredItem(item._id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <img
                  alt={item.title || 'Setup'}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    hoveredItem === item._id ? 'opacity-90' : 'opacity-100'
                  }`}
                  src={item.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                  {item.title && (
                    <span className="text-xs font-bold text-white mb-1">{item.title}</span>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent-green text-sm fill-1">
                      favorite
                    </span>
                    {item.description && (
                      <span className="text-[10px] text-slate-300 line-clamp-1">
                        {item.description}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
