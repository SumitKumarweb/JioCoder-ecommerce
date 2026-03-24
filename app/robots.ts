import type { MetadataRoute } from 'next';

const DISALLOW = [
  '/nimda-pro-sumit/',
  '/api/',
  '/checkout/',
  '/studio/checkout/',
  '/cart',
  '/profile/',
  '/sale-modal/',
] as const;

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jiocoder.com'
  ).replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [...DISALLOW],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      // Common AI / LLM crawlers — same public areas as everyone else; admin & account paths stay off-limits.
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'Google-Extended',
          'anthropic-ai',
          'ClaudeBot',
          'PerplexityBot',
          'Applebot-Extended',
        ],
        allow: '/',
        disallow: [...DISALLOW],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
