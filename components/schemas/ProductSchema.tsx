interface ProductSchemaProps {
  product: {
    id: string;
    name: string;
    description?: string;
    image?: string;
    price: number;
    currency?: string;
    inStock: boolean;
    category?: string;
    brand?: string;
    rating?: number;
    reviewCount?: number;
    sku?: string;
  };
  url: string;
}

export default function ProductSchema({ product, url }: ProductSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jiocoder.com';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  const imageUrl = product.image 
    ? (product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`)
    : `${baseUrl}/logo.png`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || `${product.name} - Premium ${product.category || 'product'} from JioCoder`,
    "image": imageUrl,
    "sku": product.sku || product.id,
    "mpn": product.sku || product.id,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "JioCoder"
    },
    "category": product.category || "Gaming Peripherals",
    "offers": {
      "@type": "Offer",
      "url": fullUrl,
      "priceCurrency": product.currency || "INR",
      "price": product.price.toString(),
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.inStock 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "JioCoder"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "INR"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "IN"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "businessDays": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
          },
          "cutoffTime": "14:00",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 2,
            "maxValue": 5,
            "unitCode": "DAY"
          }
        }
      }
    },
    ...(product.rating && product.reviewCount ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating.toString(),
        "reviewCount": product.reviewCount.toString(),
        "bestRating": "5",
        "worstRating": "1"
      }
    } : {})
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

