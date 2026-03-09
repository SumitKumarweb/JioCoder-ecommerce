export default function OrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jiocoder.com';

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "JioCoder",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": "Premium mechanical keyboards, gaming mice, keycaps, and custom cables. Fast India-wide shipping and authentic products.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi"]
    },
    "sameAs": [
      // Add your social media links here when available
      // "https://www.facebook.com/jiocoder",
      // "https://www.instagram.com/jiocoder",
      // "https://twitter.com/jiocoder"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

