import { getSiteUrl } from '@/lib/seo/getSiteUrl';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const baseUrl = getSiteUrl();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const position = index + 1;
      const path = item.href
        ? item.href.startsWith('http')
          ? item.href
          : `${baseUrl}${item.href.startsWith('/') ? item.href : `/${item.href}`}`
        : undefined;
      return {
        '@type': 'ListItem',
        position,
        name: item.label,
        ...(path ? { item: path } : {}),
      };
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

