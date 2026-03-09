/**
 * API utility functions for making requests
 * Handles both development (relative paths) and production (absolute URLs)
 */

/**
 * Get the base URL for API requests
 * In development, uses relative paths if NEXT_PUBLIC_API_URL is not set
 * In production, uses NEXT_PUBLIC_API_URL or falls back to NEXT_PUBLIC_SITE_URL
 */
export function getApiBaseUrl(): string {
  // If explicitly set, use it
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // In browser, use relative paths (works with same-origin)
  if (typeof window !== 'undefined') {
    return '';
  }

  // Server-side: use environment variable or default
  return process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_SITE_URL || '';
}

/**
 * Build a full API URL from a path
 * @param path - API path (e.g., '/api/products')
 * @returns Full URL or relative path
 */
export function getApiUrl(path: string): string {
  const baseUrl = getApiBaseUrl();
  
  // Remove leading slash from path if baseUrl already ends with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  if (!baseUrl) {
    return cleanPath;
  }
  
  // Ensure baseUrl doesn't end with / and path starts with /
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBaseUrl}${cleanPath}`;
}

/**
 * Fetch wrapper that handles API URLs correctly
 * @param path - API path (e.g., '/api/products')
 * @param options - Fetch options
 */
export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const url = getApiUrl(path);
  return fetch(url, options);
}

