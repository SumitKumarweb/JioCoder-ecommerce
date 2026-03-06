'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import LoginModal from '@/components/LoginModal';

interface WishlistProduct {
  _id: string;
  id: string;
  name: string;
  image?: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  slug?: string;
}

export default function WishlistContent() {
  const { wishlistIds, removeFromWishlist, isLoading: wishlistLoading } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const loadWishlistProducts = async () => {
      if (wishlistLoading) return;

      setLoading(true);
      try {
        if (wishlistIds.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        // Fetch all products and filter by wishlist IDs
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');

        const allProducts = await res.json();
        const wishlistProducts = allProducts.filter((p: any) =>
          wishlistIds.includes(p._id) || wishlistIds.includes(p.id || p.slug)
        );

        setProducts(wishlistProducts.map((p: any) => ({
          _id: p._id,
          id: p._id,
          name: p.name,
          image: p.image,
          price: p.price,
          originalPrice: p.originalPrice,
          inStock: p.inStock,
          slug: p.slug,
        })));
      } catch (error) {
        console.error('Failed to load wishlist products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadWishlistProducts();
  }, [wishlistIds, wishlistLoading]);

  const handleRemove = async (productId: string) => {
    await removeFromWishlist(productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId && p._id !== productId));
  };

  const handleMoveToCart = (product: WishlistProduct) => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (!userId) {
      setIsLoginModalOpen(true);
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      image: product.image || '',
      price: product.price,
    });
  };

  const handleClearAll = async () => {
    for (const productId of wishlistIds) {
      await removeFromWishlist(productId);
    }
    setProducts([]);
  };

  if (loading || wishlistLoading) {
    return (
      <div className="flex-1">
        <div className="flex items-baseline justify-between mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">My Wishlist</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Loading...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 animate-pulse">
              <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-lg mb-4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="flex items-baseline justify-between mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">My Wishlist</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            You have {products.length} {products.length === 1 ? 'item' : 'items'} saved in your wishlist
          </p>
        </div>
        {products.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-primary text-sm font-bold hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="flex-col items-center justify-center py-20 px-4 text-center">
          <div className="size-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-6 mx-auto">
            <span className="material-symbols-outlined text-5xl">heart_broken</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
            Your wishlist is empty
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 mx-auto">
            Save items you like to see them here later. You can also move them to your cart easily.
          </p>
          <Link
            href="/products"
            className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-all"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <button
                type="button"
                onClick={() => handleRemove(product.id)}
                className="absolute top-3 right-3 z-10 size-9 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                aria-label="Remove from wishlist"
              >
                <span className="material-symbols-outlined text-xl">delete</span>
              </button>
              <div className="aspect-square w-full bg-slate-50 dark:bg-slate-800 overflow-hidden">
                <Link href={product.slug ? `/product/${product.slug}` : `/product/${product.id}`}>
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={product.name}
                    src={product.image || '/placeholder-product.jpg'}
                  />
                </Link>
              </div>
              <div className="p-5">
                <div className="mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      product.inStock
                        ? 'text-primary bg-primary/10'
                        : 'text-amber-500 bg-amber-500/10'
                    }`}
                  >
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <Link href={product.slug ? `/product/${product.slug}` : `/product/${product.id}`}>
                  <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 mb-1 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleMoveToCart(product)}
                  className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl">shopping_bag</span>
                  Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}

