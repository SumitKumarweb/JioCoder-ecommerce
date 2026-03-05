'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { useCart } from '@/contexts/CartContext';

interface OrderData {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
}

export default function OrderSuccessPage() {
  const router = useRouter();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(true);
  const [deliveryDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3); // 3 days from now
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  });

  // Store cart items before clearing (for display)
  const [orderedItems] = useState(cartItems);

  // Create order in MongoDB
  useEffect(() => {
    const createOrder = async () => {
      // Get form data and payment data from localStorage
      const formDataStr = localStorage.getItem('checkoutFormData');
      const paymentDataStr = localStorage.getItem('paymentData');

      if (!formDataStr || !paymentDataStr || orderedItems.length === 0) {
        router.push('/cart');
        return;
      }

      try {
        const formData = JSON.parse(formDataStr);
        const paymentData = JSON.parse(paymentDataStr);

        // Prepare order items
        const orderItems = orderedItems.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        }));

        // Prepare shipping address
        const shippingAddress = {
          name: formData.fullName,
          mobile: formData.mobile,
          address: formData.address,
          locality: formData.locality,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
          addressType: formData.addressType,
        };

        // Create order via API
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerName: formData.fullName,
            customerEmail: formData.mobile ? `${formData.mobile}@example.com` : 'customer@example.com', // Generate email from mobile
            items: orderItems,
            total: paymentData.finalTotal,
            currency: 'INR',
            status: 'PENDING',
            paymentStatus: 'PAID',
            paymentMethod: paymentData.method,
            shippingAddress: shippingAddress,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create order');
        }

        const createdOrder = await response.json();
        setOrderData({
          _id: createdOrder._id,
          orderNumber: createdOrder.orderNumber,
          customerName: createdOrder.customerName,
          customerEmail: createdOrder.customerEmail,
          total: createdOrder.total,
        });

        // Clear localStorage
        localStorage.removeItem('checkoutFormData');
        localStorage.removeItem('paymentData');

        // Clear cart
        clearCart();
      } catch (error) {
        console.error('Failed to create order:', error);
        // Still redirect but show error
        router.push('/cart');
      } finally {
        setIsCreatingOrder(false);
      }
    };

    createOrder();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Redirect to cart if no items (shouldn't happen, but safety check)
  useEffect(() => {
    if (!isCreatingOrder && orderedItems.length === 0 && !orderData) {
      router.push('/cart');
    }
  }, [isCreatingOrder, orderedItems.length, orderData, router]);

  // Get shipping address from localStorage if available
  const [shippingAddress, setShippingAddress] = useState({
    name: 'Customer',
    address: '',
    locality: '',
    city: '',
    state: '',
    pinCode: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const formDataStr = localStorage.getItem('checkoutFormData');
      if (formDataStr) {
        try {
          const formData = JSON.parse(formDataStr);
          setShippingAddress({
            name: formData.fullName || 'Customer',
            address: formData.address || '',
            locality: formData.locality || '',
            city: formData.city || '',
            state: formData.state || '',
            pinCode: formData.pinCode || '',
          });
        } catch (e) {
          console.error('Failed to parse checkout form data:', e);
        }
      }
    }
  }, []);
  const userEmail = orderData?.customerEmail || 'customer@example.com';
  const finalTotal = orderData?.total || 0;

  if (isCreatingOrder) {
    return (
      <>
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-slate-600">Creating your order...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (orderedItems.length === 0 || !orderData) {
    return null; // Will redirect
  }

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Cart', href: '/cart' },
            { label: 'Checkout', href: '/checkout' },
            { label: 'Order Confirmation' },
          ]}
        />

        {/* Main Success Card */}
        <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mt-6">
          {/* Success Header Section */}
          <div className="pt-12 pb-8 px-8 flex flex-col items-center text-center">
            <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <div className="size-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/40">
                <span className="material-symbols-outlined text-white text-4xl font-bold">check</span>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Thank you for your order!</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Your order has been placed successfully. A confirmation email with details has been sent to{' '}
              <span className="text-slate-900 font-medium">{userEmail}</span>
            </p>
          </div>

          {/* Order Details Section */}
          <div className="bg-slate-50 border-y border-slate-100 px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Order ID</p>
                <p className="text-lg font-mono font-bold text-slate-900">#{orderData.orderNumber}</p>
              </div>
              <div className="md:text-right">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Estimated Delivery
                </p>
                <p className="text-lg font-semibold text-slate-900">{deliveryDate}</p>
              </div>
            </div>
          </div>

          {/* Tracking & Info */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Delivery Address Snippet */}
              <div className="flex gap-4 p-4 rounded-lg bg-white border border-slate-100">
                <div className="text-primary mt-1">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Shipping to</h4>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    {shippingAddress.name}
                    <br />
                    {shippingAddress.address && (
                      <>
                        {shippingAddress.address}
                        {shippingAddress.locality && `, ${shippingAddress.locality}`}
                        <br />
                      </>
                    )}
                    {shippingAddress.city && (
                      <>
                        {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pinCode}
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href={`/orders/${orderData._id}`}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Track Order</span>
                  <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
                <Link
                  href="/products"
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl">shopping_bag</span>
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Mini Summary Footer */}
          <div className="px-8 py-4 bg-slate-50 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <span className="material-symbols-outlined text-lg">help_outline</span>
              <span>Need help with your order?</span>
            </div>
            <Link href="/support" className="text-primary font-semibold hover:underline flex items-center gap-1">
              Contact Support
            </Link>
          </div>
        </div>

        {/* Order Summary Preview */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4 px-2">
            Order Items ({orderedItems.length})
          </h3>
          <div className="space-y-3">
            {orderedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-100"
              >
                <div className="size-16 bg-slate-50 rounded flex-shrink-0 overflow-hidden">
                  <img className="w-full h-full object-cover" alt={item.name} src={item.image} />
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-semibold text-slate-900">{item.name}</h5>
                  <p className="text-xs text-slate-500 mt-1">
                    Qty: {item.quantity} {item.variant && `• ${item.variant}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div className="mt-6 bg-white p-4 rounded-lg border border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Total Amount Paid</span>
              <span className="text-xl font-black text-primary">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Quick Links Footer */}
        <div className="mt-12 text-center text-slate-400 text-sm">
          <div className="flex justify-center gap-6 mb-4">
            <Link href="/policies/order" className="hover:text-primary transition-colors">
              Order Policy
            </Link>
            <Link href="/policies/return" className="hover:text-primary transition-colors">
              Return Policy
            </Link>
            <Link href="/faq" className="hover:text-primary transition-colors">
              FAQ
            </Link>
          </div>
          <p>© 2024 JioCoder India. All rights reserved.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}

