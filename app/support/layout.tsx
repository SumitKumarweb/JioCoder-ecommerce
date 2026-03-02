import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help & Support - JioCoder',
  description:
    'Get help with your orders, returns, payments, warranty claims, and technical support. Contact our 24/7 customer service team via live chat, email, or phone.',
  keywords: ['customer support', 'help center', 'contact support', 'order tracking', 'returns', 'warranty'],
  openGraph: {
    title: 'Help & Support - JioCoder',
    description: 'Get help with your orders, returns, payments, warranty claims, and technical support.',
    type: 'website',
  },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

