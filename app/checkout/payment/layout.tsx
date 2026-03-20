import { WebPageSchema } from '@/components/schemas';

export default function CheckoutPaymentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageSchema
        path="/checkout/payment"
        name="Payment - JioCoder Checkout"
        description="Choose payment method and complete your JioCoder order."
      />
      {children}
    </>
  );
}
