import sanitizeHtml from "sanitize-html";

type SanitizeOptions = NonNullable<Parameters<typeof sanitizeHtml>[1]>;

const BLOG_SANITIZE_OPTIONS: SanitizeOptions = {
  allowedTags: [
    "p",
    "br",
    "div",
    "span",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "strike",
    "sub",
    "sup",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "blockquote",
    "code",
    "pre",
    "hr",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "table",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "th",
    "td",
    "figure",
    "figcaption",
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel", "title"],
    img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
    th: ["colspan", "rowspan", "scope"],
    td: ["colspan", "rowspan"],
    "*": ["class", "id"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: {
    img: ["http", "https"],
    a: ["http", "https", "mailto", "tel"],
  },
  allowProtocolRelative: false,
};

export function sanitizeBlogHtml(html: string): string {
  if (!html) return "";
  return sanitizeHtml(html, BLOG_SANITIZE_OPTIONS);
}
