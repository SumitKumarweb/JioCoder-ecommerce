import { WebPageSchema } from '@/components/schemas';
import CheckoutAddressClient from './CheckoutAddressClient';

export default function CheckoutPage() {
  return (
    <>
      <h1 className="sr-only">Checkout shipping details</h1>
      <WebPageSchema
        path="/checkout"
        name="Checkout - JioCoder"
        description="Shipping and delivery details for your JioCoder order."
      />
      <CheckoutAddressClient />
    </>
  );
}
