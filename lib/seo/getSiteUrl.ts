/**
 * Canonical site origin for JSON-LD, Open Graph absolute URLs, etc.
 */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jiocoder.com').replace(
    /\/$/,
    ''
  );
}
