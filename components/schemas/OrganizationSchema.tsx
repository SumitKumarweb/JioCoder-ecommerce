export default function OrganizationSchema() {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jiocoder.com'
  ).replace(/\/$/, '');

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'JioCoder',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          '@id': `${baseUrl}/#logo`,
          url: `${baseUrl}/logo.png`,
          contentUrl: `${baseUrl}/logo.png`,
          caption: 'JioCoder',
        },
        image: { '@id': `${baseUrl}/#logo` },
        description:
          "Premium mechanical keyboards, gaming mice, keycaps, and custom cables. India's leading destination for authentic gaming peripherals with fast nationwide shipping.",
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IN',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            areaServed: 'IN',
            availableLanguage: ['en', 'hi'],
          },
        ],
        sameAs: [
          // Add verified social profiles once available:
          // 'https://www.instagram.com/jiocoder',
          // 'https://twitter.com/jiocoder',
          // 'https://www.facebook.com/jiocoder',
          // 'https://www.youtube.com/@jiocoder',
          // 'https://www.linkedin.com/company/jiocoder',
        ],
        foundingDate: '2024',
        numberOfEmployees: {
          '@type': 'QuantitativeValue',
          minValue: 1,
          maxValue: 50,
        },
        knowsAbout: [
          'Mechanical Keyboards',
          'Gaming Peripherals',
          'Keycaps',
          'Custom Cables',
          'Gaming Mice',
        ],
        areaServed: {
          '@type': 'Country',
          name: 'India',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'JioCoder',
        description:
          'Premium mechanical keyboards, gaming mice, keycaps, and custom cables.',
        publisher: { '@id': `${baseUrl}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/products?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        inLanguage: 'en-IN',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
