import type { Metadata } from 'next';

// Metadata to exclude this page from SEO/Google indexing
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noindex: true,
    nofollow: true,
    googleBot: {
      index: false,
      follow: false,
      noindex: true,
      nofollow: true,
    },
  },
  title: 'Flash Sale - Limited Time Offer',
};

export default function SaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

