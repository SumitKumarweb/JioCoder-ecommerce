'use client';

import { useEffect, useState } from 'react';

interface CommunityReview {
  _id: string;
  avatarUrl?: string;
  authorName: string;
  content: string;
  rating: number;
  image?: string;
  // Optional social-style fields
  likes?: string;
  comments?: number;
}

export default function CommunityReviews() {
  const [reviews, setReviews] = useState<CommunityReview[]>([]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await fetch('/api/community-reviews');
        if (!res.ok) {
          throw new Error(`Failed to fetch community reviews: ${res.status}`);
        }
        const data: CommunityReview[] = await res.json();
        setReviews(data || []);
      } catch (error) {
        console.error('Failed to load community reviews from API', error);
      }
    };

    loadReviews();
  }, []);

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold tracking-tight">Community Reviews</h3>
          <p className="text-slate-500 text-sm">
            Authentic setup showcases from our premium community.
          </p>
        </div>
        <a
          className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline"
          href="#"
        >
          Follow @JioCoder
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer shadow-sm"
          >
            <img
              alt={`Video Review from ${review.authorName}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              src={review.image}
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity group-hover:opacity-0">
              <span className="material-symbols-outlined text-white text-4xl opacity-80">
                play_circle
              </span>
            </div>
            <div className="absolute inset-0 video-overlay opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white font-bold text-xs">{review.authorName}</span>
              </div>
              <p className="text-white text-[10px] leading-tight line-clamp-2 mb-2 italic">
                {review.content}
              </p>
              <div className="flex items-center gap-3 text-white">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs fill-1">favorite</span>
                  <span className="text-[10px] font-bold">{review.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">chat_bubble</span>
                  <span className="text-[10px] font-bold">{review.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

