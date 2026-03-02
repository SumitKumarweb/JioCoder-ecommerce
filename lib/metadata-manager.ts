// Client-side metadata manager for reading metadata from localStorage
// Note: This is for client-side use. Server-side metadata should use generateMetadata()

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

export class MetadataManager {
  getPageMetadata(pageId: string): PageMetadata {
    if (typeof window === 'undefined') {
      // Server-side: return defaults
      return this.getDefaultPageMetadata(pageId);
    }

    const saved = localStorage.getItem('pageMetadata');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed[pageId]) {
        return parsed[pageId];
      }
    }
    return this.getDefaultPageMetadata(pageId);
  }

  getProductMetadata(productId: string): ProductMetadata | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const saved = localStorage.getItem('adminProducts');
    if (saved) {
      const products = JSON.parse(saved);
      const product = products.find((p: any) => p.id === productId);
      return product?.metadata || null;
    }
    return null;
  }

  getCollectionMetadata(collectionSlug: string): ProductMetadata | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const saved = localStorage.getItem('adminCollections');
    if (saved) {
      const collections = JSON.parse(saved);
      const collection = collections.find((c: any) => c.slug === collectionSlug);
      return collection?.metadata || null;
    }
    return null;
  }

  private getDefaultPageMetadata(pageId: string): PageMetadata {
    const defaults: { [key: string]: PageMetadata } = {
      home: {
        metaTitle: 'JioCoder - Premium Mechanical Keyboards & Gaming Peripherals',
        metaDescription: 'Discover premium mechanical keyboards, gaming mice, keycaps, and custom cables at JioCoder. Shop trending products, best sellers, and authentic gear with fast India-wide shipping.',
        metaKeywords: 'mechanical keyboards, gaming mice, keycaps, custom cables, gaming peripherals, India keyboard store',
        ogTitle: 'JioCoder - Premium Mechanical Keyboards & Gaming Peripherals',
        ogDescription: 'Discover premium mechanical keyboards, gaming mice, keycaps, and custom cables. Fast India-wide shipping and authentic products.',
        ogImage: '',
        canonicalUrl: '/',
      },
      about: {
        metaTitle: 'About Us - JioCoder',
        metaDescription:
          "Learn about JioCoder - India's premier destination for high-end electronics. Our journey from startup vision to India's tech hub, serving 500k+ customers with genuine gear and 24/7 support.",
        metaKeywords: 'about jiocoder, tech company india, electronics retailer, about us',
        ogTitle: 'About Us - JioCoder',
        ogDescription:
          "Learn about JioCoder - India's premier destination for high-end electronics. Our journey from startup vision to India's tech hub.",
        ogImage: '',
        canonicalUrl: '/about',
      },
      products: {
        metaTitle: 'Products - JioCoder',
        metaDescription: 'Browse our collection of premium mechanical keyboards, gaming mice, and accessories.',
        metaKeywords: 'products, keyboards, gaming mice, accessories',
        ogTitle: 'Products - JioCoder',
        ogDescription: 'Browse our collection of premium mechanical keyboards, gaming mice, and accessories.',
        ogImage: '',
        canonicalUrl: '/products',
      },
      collections: {
        metaTitle: 'Collections - JioCoder',
        metaDescription: 'Explore our curated collections of premium tech products.',
        metaKeywords: 'collections, tech products, curated',
        ogTitle: 'Collections - JioCoder',
        ogDescription: 'Explore our curated collections of premium tech products.',
        ogImage: '',
        canonicalUrl: '/collections',
      },
    };
    return defaults[pageId] || defaults.home;
  }
}

