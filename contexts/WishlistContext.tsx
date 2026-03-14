'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import LoginModal from "@/components/LoginModal";

const WISHLIST_STORAGE_KEY = 'wishlist_product_ids';
const USER_ID_KEY = 'userId';

interface WishlistContextType {
  wishlistIds: string[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  syncWishlist: () => Promise<void>;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {

  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);


  // Load wishlist on mount
  useEffect(() => {
const userId = localStorage.getItem("userId");
  if (userId) {
    setIsLoggedIn(true);
  }
    const loadWishlist = async () => {

      if (typeof window === "undefined") return;

      const userId = localStorage.getItem(USER_ID_KEY);

      try {

        if (userId) {

          const res = await fetch(`/api/wishlist?userId=${userId}`);

          if (res.ok) {
            const data = await res.json();
            setWishlistIds(data.productIds || []);

            localStorage.setItem(
              WISHLIST_STORAGE_KEY,
              JSON.stringify(data.productIds || [])
            );
          }

        } else {

          const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);

          if (stored) {
            setWishlistIds(JSON.parse(stored));
          }

        }

      } catch (error) {
        console.error("Failed to load wishlist:", error);
      } finally {
        setIsLoading(false);
      }

    };

    loadWishlist();
  }, []);

  const isInWishlist = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  const addToWishlist = async (productId: string) => {

    const userId = typeof window !== "undefined"
      ? localStorage.getItem(USER_ID_KEY)
      : null;

    if (!userId) {
      setShowLoginModal(true);
      return;
    }

    if (isInWishlist(productId)) return;

    const newIds = [...wishlistIds, productId];

    setWishlistIds(newIds);

    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newIds));

    try {

      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userId }),
      });

    } catch (error) {
      console.error("Wishlist sync failed:", error);
    }

  };

  const removeFromWishlist = async (productId: string) => {

    const userId = typeof window !== "undefined"
      ? localStorage.getItem(USER_ID_KEY)
      : null;

    const newIds = wishlistIds.filter((id) => id !== productId);

    setWishlistIds(newIds);

    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newIds));

    if (!userId) return;

    try {

      await fetch(`/api/wishlist?productId=${productId}&userId=${userId}`, {
        method: 'DELETE',
      });

    } catch (error) {
      console.error("Remove wishlist failed:", error);
    }

  };

  const syncWishlist = async () => {

    const userId = typeof window !== "undefined"
      ? localStorage.getItem(USER_ID_KEY)
      : null;

    if (!userId) return;

    try {

      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      const localIds = stored ? JSON.parse(stored) : [];

    const res = await fetch('/api/wishlist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productIds: localIds }),
      });

      if (res.ok) {
        const data = await res.json();

        setWishlistIds(data.productIds || []);

        localStorage.setItem(
          WISHLIST_STORAGE_KEY,
          JSON.stringify(data.productIds || [])
        );
      }

    } catch (error) {
      console.error("Wishlist sync failed:", error);
    }

  };

  if (isLoading) return null;

    return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        syncWishlist,
        isLoading,
      }}
    >

      {children}

      <LoginModal 
  isOpen={showLoginModal}
  onClose={() => setShowLoginModal(false)}
/>

    </WishlistContext.Provider>
  );

}

export function useWishlist() {

  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }

  return context;
}