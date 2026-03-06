'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import LoginModal from './LoginModal';

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: {
    text: string;
    color: 'red' | 'green' | 'primary';
  };
  discount?: number;
  collectionSlug?: string;
}

export default function ProductCard({
  id,
  name,
  image,
  price,
  originalPrice,
  rating,
  reviewCount,
  badge,
  discount,
  collectionSlug,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="material-symbols-outlined text-[16px] fill-1">
          star
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="material-symbols-outlined text-[16px] fill-1">
          star_half
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="material-symbols-outlined text-[16px]">
          star
        </span>
      );
    }

    return stars;
  };

  const badgeColors = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    primary: 'bg-primary',
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id,
      name,
      image,
      price,
    });
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    
    if (!userId) {
      // Open login modal if not logged in
      setIsLoginModalOpen(true);
      return;
    }

    // Toggle wishlist
    if (isInWishlist(id)) {
      await removeFromWishlist(id);
    } else {
      await addToWishlist(id);
    }
  };

  return (
    <div className="product-card bg-white rounded-xl border border-slate-200 p-4 hover:shadow-2xl hover:shadow-primary/5 transition-all group relative">
      {badge && (
        <div
          className={`absolute top-4 left-4 z-10 ${badgeColors[badge.color]} text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest`}
        >
          {badge.text}
        </div>
      )}
      <div className="aspect-square rounded-lg bg-slate-50 mb-4 overflow-hidden relative">
        <Link href={collectionSlug ? `/collections/${collectionSlug}/${id}` : `/product/${id}`}>
          <img
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            src={image}
          />
        </Link>
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-10 size-9 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center transition-all shadow-sm hover:scale-110 ${
            isInWishlist(id) ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
          }`}
          aria-label={isInWishlist(id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <span className={`material-symbols-outlined text-xl ${isInWishlist(id) ? 'fill-1' : ''}`}>
            favorite
          </span>
        </button>
        {/* Quick Action Overlay */}
        <div className="absolute inset-x-0 bottom-4 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleAddToCart}
            className="add-to-cart-btn w-full bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
            Add to Cart
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1 mb-1">
          <div className="flex text-yellow-400">{renderStars(rating)}</div>
          <span className="text-[11px] font-bold text-slate-400">
            ({reviewCount >= 1000 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount})
          </span>
        </div>
        <Link href={collectionSlug ? `/collections/${collectionSlug}/${id}` : `/product/${id}`}>
          <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 min-h-[40px] hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-primary">₹{price.toLocaleString('en-IN')}</span>
          {originalPrice && (
            <span className="text-xs font-medium text-slate-400 line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}

