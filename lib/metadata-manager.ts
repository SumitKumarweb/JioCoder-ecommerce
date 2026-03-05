// Metadata manager for reading metadata from API
// Supports both server-side (generateMetadata) and client-side use

export interface PageMetadata {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
}

export interface ProductMetadata {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

// Map pageId to path
function getPathFromPageId(pageId: string): string {
  const pathMap: { [key: string]: string } = {
    home: '/',
    about: '/about',
    products: '/products',
    collections: '/collections',
  };
  return pathMap[pageId] || `/${pageId}`;
}

// Minimal fallback metadata
function getFallbackMetadata(pageId: string): PageMetadata {
  const path = getPathFromPageId(pageId);
  
  return {
    metaTitle: 'JioCoder - Premium Mechanical Keyboards & Gaming Peripherals',
    metaDescription: 'Discover premium mechanical keyboards, gaming mice, keycaps, and custom cables at JioCoder.',
    metaKeywords: 'mechanical keyboards, gaming mice, keycaps, custom cables, gaming peripherals',
    ogTitle: 'JioCoder - Premium Mechanical Keyboards & Gaming Peripherals',
    ogDescription: 'Discover premium mechanical keyboards, gaming mice, keycaps, and custom cables.',
    ogImage: '',
    canonicalUrl: path,
  };
}

export class MetadataManager {
  async getPageMetadata(pageId: string): Promise<PageMetadata> {
    const path = getPathFromPageId(pageId);
    
    try {
      // Construct API URL - works for both server and client
      let apiUrl: string;
      if (typeof window === 'undefined') {
        // Server-side: need absolute URL
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
          (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://www.jiocoder.com');
        apiUrl = `${baseUrl}/api/page-metadata?path=${encodeURIComponent(path)}`;
      } else {
        // Client-side: use relative URL
        apiUrl = `/api/page-metadata?path=${encodeURIComponent(path)}`;
      }
      
      const response = await fetch(apiUrl, {
        cache: 'no-store', // Always fetch fresh data for metadata
      });

      if (response.ok) {
        const data = await response.json();
        
        // Map API response to PageMetadata interface
        if (data && data.path) {
          return {
            metaTitle: data.metaTitle || '',
            metaDescription: data.metaDescription || '',
            metaKeywords: data.metaKeywords || '',
            ogTitle: data.ogTitle || data.metaTitle || '',
            ogDescription: data.ogDescription || data.metaDescription || '',
            ogImage: data.ogImage || '',
            canonicalUrl: data.canonicalUrl || path,
          };
        }
      }
    } catch (error) {
      console.error(`Failed to fetch metadata for ${path}:`, error);
    }

    // Return fallback if API call fails
    return getFallbackMetadata(pageId);
  }

  // Synchronous version for backward compatibility (uses fallback)
  getPageMetadataSync(pageId: string): PageMetadata {
    if (typeof window !== 'undefined') {
      // Client-side: try localStorage first
      const saved = localStorage.getItem('pageMetadata');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed[pageId]) {
            return parsed[pageId];
          }
        } catch (e) {
          console.error('Failed to parse localStorage metadata:', e);
        }
      }
    }
    
    // Return fallback
    return getFallbackMetadata(pageId);
  }

  getProductMetadata(productId: string): ProductMetadata | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const saved = localStorage.getItem('adminProducts');
    if (saved) {
      try {
        const products = JSON.parse(saved);
        const product = products.find((p: any) => p.id === productId);
        return product?.metadata || null;
      } catch (e) {
        console.error('Failed to parse localStorage products:', e);
      }
    }
    return null;
  }

  getCollectionMetadata(collectionSlug: string): ProductMetadata | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const saved = localStorage.getItem('adminCollections');
    if (saved) {
      try {
        const collections = JSON.parse(saved);
        const collection = collections.find((c: any) => c.slug === collectionSlug);
        return collection?.metadata || null;
      } catch (e) {
        console.error('Failed to parse localStorage collections:', e);
      }
    }
    return null;
  }
}

