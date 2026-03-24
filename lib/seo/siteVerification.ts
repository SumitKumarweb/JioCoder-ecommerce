import type { Metadata } from 'next';

/**
 * Optional search-console verification meta tags (set in `.env.local`, never `NEXT_PUBLIC_*`).
 * - Google: `GOOGLE_SITE_VERIFICATION`
 * - Yandex: `YANDEX_SITE_VERIFICATION` (omit if unused)
 * - Bing: `BING_SITE_VERIFICATION` → `msvalidate.01`
 */
export function buildSiteVerification(): Metadata['verification'] | undefined {
  const google = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  const yandex = process.env.YANDEX_SITE_VERIFICATION?.trim();
  const bing = process.env.BING_SITE_VERIFICATION?.trim();

  const out: NonNullable<Metadata['verification']> = {};
  if (google) out.google = google;
  if (yandex) out.yandex = yandex;
  if (bing) out.other = { ...(out.other ?? {}), 'msvalidate.01': bing };

  return Object.keys(out).length > 0 ? out : undefined;
}
