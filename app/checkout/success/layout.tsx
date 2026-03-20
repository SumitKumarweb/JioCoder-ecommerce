import { WebPageSchema } from '@/components/schemas';

export default function CheckoutSuccessLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageSchema
        path="/checkout/success"
        name="Order confirmation - JioCoder"
        description="Your JioCoder order was placed successfully."
      />
      {children}
    </>
  );
}
