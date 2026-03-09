interface Product {
  id: string;
  name: string;
  image?: string;
  price: number;
  currency?: string;
  inStock: boolean;
  category?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
}

interface ProductListSchemaProps {
  products: Product[];
  pageUrl: string;
  pageTitle?: string;
  pageDescription?: string;
}

export default function ProductListSchema({ 
  products, 
  pageUrl, 
  pageTitle = "Products",
  pageDescription 
}: ProductListSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jiocoder.com';
  const fullUrl = pageUrl.startsWith('http') ? pageUrl : `${baseUrl}${pageUrl}`;

  // Create ItemList schema for product listings
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": pageTitle,
    "description": pageDescription || `Browse our collection of ${products.length} premium products`,
    "url": fullUrl,
    "numberOfItems": products.length,
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "image": product.image 
          ? (product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`)
          : `${baseUrl}/logo.png`,
        "offers": {
          "@type": "Offer",
          "priceCurrency": product.currency || "INR",
          "price": product.price.toString(),
          "availability": product.inStock 
            ? "https://schema.org/InStock" 
            : "https://schema.org/OutOfStock"
        },
        "url": `${baseUrl}/product/${product.id}`,
        ...(product.brand ? {
          "brand": {
            "@type": "Brand",
            "name": product.brand
          }
        } : {}),
        ...(product.category ? {
          "category": product.category
        } : {}),
        ...(product.rating && product.reviewCount ? {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": product.rating.toString(),
            "reviewCount": product.reviewCount.toString()
          }
        } : {})
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
    />
  );
}

