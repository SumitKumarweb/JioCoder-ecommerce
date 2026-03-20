import { getSiteUrl } from '@/lib/seo/getSiteUrl';

export type WebPageSchemaType =
  | 'WebPage'
  | 'AboutPage'
  | 'ContactPage'
  | 'FAQPage'
  | 'CollectionPage'
  | 'ItemPage'
  | 'ProfilePage'
  | 'BlogPosting';

type BaseProps = {
  path: string;
  name: string;
  description?: string;
  type?: Exclude<WebPageSchemaType, 'BlogPosting'>;
  dateModified?: string;
};

type BlogPostingProps = {
  path: string;
  name: string;
  description?: string;
  type: 'BlogPosting';
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
  /** Comma-separated or single string for schema.org keywords */
  keywords?: string;
  articleSection?: string;
};

export default function WebPageSchema(props: BaseProps | BlogPostingProps) {
  const base = getSiteUrl();
  const normalizedPath = props.path.startsWith('/') ? props.path : `/${props.path}`;
  const url = `${base}${normalizedPath}`;

  if (props.type === 'BlogPosting') {
    const blog = props;
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${url}#blogposting`,
      headline: blog.name,
      name: blog.name,
      description: blog.description ?? blog.name,
      url,
      inLanguage: 'en-IN',
      isPartOf: { '@id': `${base}/#website` },
      publisher: { '@id': `${base}/#organization` },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${url}#webpage` },
    };
    if (blog.image) schema.image = [blog.image];
    if (blog.datePublished) schema.datePublished = blog.datePublished;
    if (blog.dateModified) schema.dateModified = blog.dateModified;
    if (blog.authorName) {
      schema.author = { '@type': 'Person', name: blog.authorName };
    }
    if (blog.keywords) schema.keywords = blog.keywords;
    if (blog.articleSection) schema.articleSection = blog.articleSection;
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  }

  const schemaType = props.type ?? 'WebPage';

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': `${url}#webpage`,
    url,
    name: props.name,
    description: props.description ?? props.name,
    isPartOf: { '@id': `${base}/#website` },
    publisher: { '@id': `${base}/#organization` },
    inLanguage: 'en-IN',
  };
  if (props.dateModified) schema.dateModified = props.dateModified;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
