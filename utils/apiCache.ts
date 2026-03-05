// Simple in-memory cache for API responses to prevent duplicate calls
interface CacheEntry {
  data: any;
  timestamp: number;
  expiresIn: number; // milliseconds
}

const cache = new Map<string, CacheEntry>();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export function getCachedData<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > entry.expiresIn) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

export function setCachedData(key: string, data: any, ttl: number = DEFAULT_TTL): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    expiresIn: ttl,
  });
}

export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

// Cache key generators
export function getProductCacheKey(productId: string): string {
  return `product:${productId}`;
}

export function getCollectionCacheKey(slug: string): string {
  return `collection:${slug}`;
}

