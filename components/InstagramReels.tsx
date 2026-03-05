'use client';

import { useEffect, useState } from 'react';

interface InstagramReel {
  _id: string;
  title: string;
  instagramUrl: string;
  thumbnailUrl?: string;
  username: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export default function InstagramReels() {
  const [reels, setReels] = useState<InstagramReel[]>([]);

  useEffect(() => {
    const loadReels = async () => {
      try {
        const res = await fetch('/api/instagram-reels');
        if (!res.ok) {
          throw new Error(`Failed to fetch Instagram reels: ${res.status}`);
        }
        const data: InstagramReel[] = await res.json();
        console.log('Instagram Reels API Response:', data);
        console.log('Number of reels:', data?.length || 0);
        setReels(data || []);
      } catch (error) {
        console.error('Failed to load Instagram reels from API', error);
      }
    };

    loadReels();
  }, []);

  if (reels.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold tracking-tight">Instagram Reels</h3>
          <p className="text-slate-500 text-sm">
            Latest reels from our community
          </p>
        </div>
        <a
          className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline"
          href="https://www.instagram.com/jiocoder"
          target="_blank"
          rel="noopener noreferrer"
        >
          Follow @JioCoder
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {reels.map((reel) => (
          <a
            key={reel._id}
            href={reel.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-[9/16] rounded-xl overflow-hidden group cursor-pointer shadow-sm"
          >
            {reel.thumbnailUrl ? (
              <img
                alt={reel.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={reel.thumbnailUrl}
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x533?text=Instagram+Reel';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/40 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-4xl opacity-80">
                  movie
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity group-hover:opacity-0">
              <span className="material-symbols-outlined text-white text-4xl opacity-80">
                play_circle
              </span>
            </div>
            <div className="absolute inset-0 video-overlay opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white font-bold text-xs">{reel.username}</span>
              </div>
              <p className="text-white text-[10px] leading-tight line-clamp-2 mb-2 italic">
                {reel.title}
              </p>
              <div className="flex items-center gap-3 text-white">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs fill-1">favorite</span>
                  <span className="text-[10px] font-bold">{reel.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">chat_bubble</span>
                  <span className="text-[10px] font-bold">{reel.comments}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

