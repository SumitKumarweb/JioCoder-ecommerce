import type { Metadata } from 'next';
import { WebPageSchema } from '@/components/schemas';

export const metadata: Metadata = {
  title: 'Help & Support',
  description:
    'Get help with your JioCoder orders. Track shipments, manage returns and refunds, troubleshoot products, check warranty status, and reach our 24/7 customer support team.',
  keywords: [
    'jiocoder support',
    'order tracking India',
    'return policy',
    'keyboard warranty India',
    'customer service',
    'gaming peripherals support',
  ],
  alternates: {
    canonical: '/support',
  },
  openGraph: {
    title: 'Help & Support - JioCoder',
    description:
      'Get help with orders, returns, warranty, and technical support at JioCoder.',
    url: '/support',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Help & Support - JioCoder',
    description:
      'Get help with orders, returns, and technical support at JioCoder.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WebPageSchema
        path="/support"
        type="ContactPage"
        name="Help & Support - JioCoder"
        description="Get help with your JioCoder orders, tracking, returns, warranty, and technical support."
      />
      {children}
    </>
  );
}
