import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jiocoder.com'
  ).replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/nimda-pro-sumit/',
          '/api/',
          '/checkout/',
          '/studio/checkout/',
          '/cart',
          '/profile/',
          '/sale-modal/',
        ],
      },
      // Allow Google Image bot full access to product images
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
