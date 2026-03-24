import DOMPurify from "isomorphic-dompurify";

export function sanitizeBlogHtml(html: string): string {
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}
