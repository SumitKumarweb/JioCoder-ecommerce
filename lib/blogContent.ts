/**
 * Legacy posts store Markdown; TipTap saves HTML. Detect which renderer to use.
 * Avoid treating plain text as HTML (must look like a real tag open).
 */
export function isBlogContentHtml(content: string): boolean {
  const t = content.trim();
  if (!t) return false;
  if (!t.startsWith("<")) return false;
  // Block-level or inline HTML from TipTap / paste (not e.g. "<3" or "<!--")
  return /<\/?[a-z][a-z0-9]*(\s|>|\/)/i.test(t);
}
