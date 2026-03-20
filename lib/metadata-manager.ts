// Metadata manager for reading metadata from DB (server) or API (client).
// Previously the server-side path made an HTTP request to the same host, which
// was skipped on production (causing every page to fall back to default metadata).
// Now the server-side path queries MongoDB directly, which works in all environments.

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
    metaDescription:
      'Discover premium mechanical keyboards, gaming mice, keycaps, and custom cables at JioCoder.',
    metaKeywords:
      'mechanical keyboards, gaming mice, keycaps, custom cables, gaming peripherals',
    ogTitle: 'JioCoder - Premium Mechanical Keyboards & Gaming Peripherals',
    ogDescription:
      'Discover premium mechanical keyboards, gaming mice, keycaps, and custom cables.',
    ogImage: '',
    canonicalUrl: path,
  };
}

function mapDbDoc(data: any, path: string): PageMetadata {
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

export class MetadataManager {
  async getPageMetadata(pageId: string): Promise<PageMetadata> {
    const path = getPathFromPageId(pageId);

    try {
      if (typeof window === 'undefined') {
        // ── Server-side: query the database directly ──────────────────────
        // Avoid making an HTTP call to ourselves, which fails during `next build`
        // and was previously skipped entirely on production (bug).
        const connectDB = (await import('@/lib/db')).default;
        const PageMetadata = (await import('@/models/PageMetadata')).default;

        await connectDB();
        const doc = await PageMetadata.findOne({ path }).lean();
        if (doc) {
          return mapDbDoc(doc, path);
        }
        return getFallbackMetadata(pageId);
      } else {
        // ── Client-side: use the public API route ─────────────────────────
        const response = await fetch(
          `/api/page-metadata?path=${encodeURIComponent(path)}`,
          { next: { revalidate: 3600 } }
        );

        if (response.ok) {
          const data = await response.json();
          if (data && data.path) {
            return mapDbDoc(data, path);
          }
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`Failed to fetch metadata for ${path}:`, error);
      }
    }

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

