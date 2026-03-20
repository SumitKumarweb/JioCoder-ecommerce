import type { Metadata } from 'next';
import { WebPageSchema } from '@/components/schemas';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description:
    'Review items in your JioCoder cart, update quantities, and proceed to checkout for mechanical keyboards and gaming peripherals.',
  alternates: { canonical: '/cart' },
  robots: { index: true, follow: true },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageSchema
        path="/cart"
        name="Shopping Cart - JioCoder"
        description="Review your cart and proceed to checkout."
      />
      {children}
    </>
  );
}
