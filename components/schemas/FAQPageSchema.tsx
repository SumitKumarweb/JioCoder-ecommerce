type FaqItem = { question: string; answer: string };

type FAQPageSchemaProps = {
  items: FaqItem[];
};

/**
 * FAQ rich results (Google) + clearer answers for AI assistants parsing JSON-LD.
 */
export default function FAQPageSchema({ items }: FAQPageSchemaProps) {
  const filtered = items.filter((i) => i.question?.trim() && i.answer?.trim());
  if (filtered.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: filtered.map((item) => ({
      '@type': 'Question',
      name: item.question.trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.trim(),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
