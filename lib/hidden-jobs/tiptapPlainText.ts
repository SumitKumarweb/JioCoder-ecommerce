import type { TipTapDoc, TipTapNode } from './types';

function walk(nodes: TipTapNode[] | undefined, out: string[]): void {
  if (!nodes) return;
  for (const n of nodes) {
    if (n.type === 'text' && n.text) out.push(n.text);
    if (n.type === 'hardBreak') out.push('\n');
    walk(n.content, out);
  }
}

export function tiptapDocToPlainText(doc: TipTapDoc | null | undefined): string {
  if (!doc?.content?.length) return '';
  const parts: string[] = [];
  walk(doc.content, parts);
  return parts.join('').replace(/\n{3,}/g, '\n\n').trim();
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}
