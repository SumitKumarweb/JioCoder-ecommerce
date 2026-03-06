'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const WISHLIST_STORAGE_KEY = 'wishlist_product_ids';
const USER_TOKEN_KEY = 'userToken';
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

  // Load wishlist on mount
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const userId = typeof window !== 'undefined' ? localStorage.getItem(USER_ID_KEY) : null;
        
        if (userId) {
          // User is logged in - fetch from server
          const res = await fetch(`/api/wishlist?userId=${userId}`);
          if (res.ok) {
            const data = await res.json();
            setWishlistIds(data.productIds || []);
            // Also sync localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(data.productIds || []));
            }
          } else {
            // Fallback to localStorage if server fails
            const stored = typeof window !== 'undefined' ? localStorage.getItem(WISHLIST_STORAGE_KEY) : null;
            if (stored) {
              setWishlistIds(JSON.parse(stored));
            }
          }
        } else {
          // User not logged in - use localStorage
          const stored = typeof window !== 'undefined' ? localStorage.getItem(WISHLIST_STORAGE_KEY) : null;
          if (stored) {
            setWishlistIds(JSON.parse(stored));
          }
        }
      } catch (error) {
        console.error('Failed to load wishlist:', error);
        // Fallback to localStorage
        const stored = typeof window !== 'undefined' ? localStorage.getItem(WISHLIST_STORAGE_KEY) : null;
        if (stored) {
          setWishlistIds(JSON.parse(stored));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();

    // Listen for login event to sync wishlist
    const handleLogin = async () => {
      const userId = typeof window !== 'undefined' ? localStorage.getItem(USER_ID_KEY) : null;
      if (!userId) return;

      try {
        // Get localStorage wishlist
        const stored = typeof window !== 'undefined' ? localStorage.getItem(WISHLIST_STORAGE_KEY) : null;
        const localIds = stored ? JSON.parse(stored) : [];

        // Sync with server
        const res = await fetch('/api/wishlist', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, productIds: localIds }),
        });

        if (res.ok) {
          const data = await res.json();
          setWishlistIds(data.productIds || []);
          // Update localStorage with merged result
          if (typeof window !== 'undefined') {
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(data.productIds || []));
          }
        }
      } catch (error) {
        console.error('Failed to sync wishlist:', error);
      }
    };
    window.addEventListener('userLoggedIn', handleLogin);
    return () => window.removeEventListener('userLoggedIn', handleLogin);
  }, []);

  const isInWishlist = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  const addToWishlist = async (productId: string) => {
    if (isInWishlist(productId)) return;

    const userId = typeof window !== 'undefined' ? localStorage.getItem(USER_ID_KEY) : null;
    const newIds = [...wishlistIds, productId];
    setWishlistIds(newIds);

    // Update localStorage immediately
    if (typeof window !== 'undefined') {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newIds));
    }

    // If logged in, sync with server
    if (userId) {
      try {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, userId }),
        });
      } catch (error) {
        console.error('Failed to sync wishlist to server:', error);
        // Keep local state even if server fails
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!isInWishlist(productId)) return;

    const userId = typeof window !== 'undefined' ? localStorage.getItem(USER_ID_KEY) : null;
    const newIds = wishlistIds.filter((id) => id !== productId);
    setWishlistIds(newIds);

    // Update localStorage immediately
    if (typeof window !== 'undefined') {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newIds));
    }

    // If logged in, sync with server
    if (userId) {
      try {
        await fetch(`/api/wishlist?productId=${productId}&userId=${userId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Failed to sync wishlist to server:', error);
        // Keep local state even if server fails
      }
    }
  };

  const syncWishlist = async () => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem(USER_ID_KEY) : null;
    if (!userId) return;

    try {
      // Get localStorage wishlist
      const stored = typeof window !== 'undefined' ? localStorage.getItem(WISHLIST_STORAGE_KEY) : null;
      const localIds = stored ? JSON.parse(stored) : [];

      // Sync with server
      const res = await fetch('/api/wishlist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productIds: localIds }),
      });

      if (res.ok) {
        const data = await res.json();
        setWishlistIds(data.productIds || []);
        // Update localStorage with merged result
        if (typeof window !== 'undefined') {
          localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(data.productIds || []));
        }
      }
    } catch (error) {
      console.error('Failed to sync wishlist:', error);
    }
  };

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
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

