import { getSiteUrl } from "./getSiteUrl";

/** Turn stored image paths into absolute URLs for Open Graph / Twitter Cards. */
export function absoluteMediaUrl(url: string | null | undefined): string | undefined {
  const u = url?.trim();
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u;
  const base = getSiteUrl();
  return `${base}${u.startsWith("/") ? "" : "/"}${u}`;
}
