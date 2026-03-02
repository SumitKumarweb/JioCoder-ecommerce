'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
  name: string;
  sku: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  gateway: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: string;
  notes: Array<{
    author: string;
    message: string;
    timestamp: string;
  }>;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    // Mock data - replace with API call
    const mockOrders: Order[] = [
      {
        id: '4',
        orderNumber: 'JC-88291',
        customerName: 'Arpit Shrivastava',
        customerEmail: 'arpit.sh@jiocoder.com',
        customerPhone: '+91 98765 43210',
        items: [
          {
            name: 'CodeRunner Pro TKL',
            sku: 'CR-TKL-BLUE',
            quantity: 1,
            price: 8499,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5aQPzk3NtVM3lqwMIOn-jl9zFoZuj1t9Lq7p7WppEj-BowuwflySFjmVwtv2VOnITAY4g8gJCIbzS6V4aIRJd3qO3-qfVfrVYK3wnR4uyLxBRh6OmfbpDEcvFS5Ql8fbccmn-C1Z5UACU7NfAWCZlPQkuN9VcDQ7j-uD08uGKABjuZq-TFAiMwf5g0eKdjCXpSrrP-AVDSfKjDqrs4FiW0uoZo811MCf1wqc-WbSIM9FlY53r1Zy317sEGuzb_vvtUH3DiVqvVHVg',
          },
          {
            name: 'ZenFlow Ergo Mouse',
            sku: 'ZF-MSE-01',
            quantity: 1,
            price: 4200,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAImgGFTn5kg_Wlg4ZgPWlVbzkVT7kGoGM0N4TT2zidGhaBjv2eI2UgMtnIYa0Y2LflIb2yjFxyXugzKtdVpWutkpEzYOAyrcKSJq1EN2DPBOK7TTndMYqC6-uubAYFepCSTEULCpBDUCXQx-KhLiB8Q_3oGssb0WBHbAgroHYNCjc0XjPxmqZFgLjWBB644uFEFZJR6O92b7ip9-eSK1ghED68icYLuVKNjw_wfTXTsrR-7fg6kXcxF8mSLYczOYssXwHRAHALpJrL',
          },
          {
            name: 'Vortex Desk Mat (XXL)',
            sku: 'VX-MAT-XXL',
            quantity: 2,
            price: 1250,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD62fRRSFIG9YPGW4F8WWT4mdutOTaSjHvBcfRLXb9mwREj-rP6j65x7XkR3BV9IrUWAeGf0_b-0wQpzpFeDQJVpbDFbGYvN4pNrkN14lE6iaYoWWl_Voj9sUaF7slIaXGbRQQS9tn_UzCnov6blKJ6a8KX0dDrtj9Ik4z7dkZMh35CfaI69d1G5GwsQqMgFasblCPhERNwh7u0qbtrmigPtb4wCw-lVWpWfFdBXZ7Sj-eIKvgtDEAnYhnoZp2MCkQ6zqCmP7I1fGOn',
          },
        ],
        status: 'pending',
        paymentStatus: 'paid',
        paymentMethod: 'UPI',
        transactionId: 'TXN-8829100192',
        gateway: 'Razorpay',
        shippingAddress: {
          name: 'Arpit Shrivastava',
          address: '74/B, Cyber Towers, Sector 62',
          city: 'Noida',
          state: 'Uttar Pradesh',
          pincode: '201301',
          country: 'India',
        },
        subtotal: 15199,
        shipping: 0,
        tax: 2735.82,
        total: 17934.82,
        createdAt: '2024-01-15T08:15:00Z',
        notes: [
          {
            author: 'System Automator',
            message: 'Order successfully verified. Inventory reserved from Warehouse A.',
            timestamp: '2024-01-15T08:32:00Z',
          },
          {
            author: 'Meghna (Support)',
            message: 'Customer requested express delivery if possible. Checking logistics partners.',
            timestamp: '2024-01-15T10:10:00Z',
          },
        ],
      },
    ];

    const foundOrder = mockOrders.find((o) => o.id === orderId);
    setOrder(foundOrder || null);
    setLoading(false);
  }, [orderId]);

  const handleAcceptOrder = () => {
    if (!order) return;
    setOrder({ ...order, status: 'processing' });
    // In real app, make API call to update order status
    router.push(`/nimda-pro-sumit/orders/${orderId}`);
  };

  const handleCancelOrder = () => {
    if (!order) return;
    if (confirm('Are you sure you want to cancel this order?')) {
      setOrder({ ...order, status: 'cancelled' });
      // In real app, make API call to cancel order
      router.push('/nimda-pro-sumit/orders');
    }
  };

  const handleReadyToShip = () => {
    if (!order) return;
    setOrder({ ...order, status: 'shipped' });
    // In real app, make API call to update order status
  };

  const handleAddNote = () => {
    if (!order || !newNote.trim()) return;
    const note = {
      author: 'Admin User',
      message: newNote,
      timestamp: new Date().toISOString(),
    };
    setOrder({ ...order, notes: [...order.notes, note] });
    setNewNote('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
          shopping_bag
        </span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
        <Link
          href="/nimda-pro-sumit/orders"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-black tracking-tight text-gray-900">
              Order #{order.orderNumber}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>
          <p className="text-gray-500 flex items-center gap-2 font-medium">
            <span className="material-symbols-outlined text-sm">person</span>
            Customer: <span className="text-gray-900">{order.customerName}</span>
            <span className="mx-1">•</span>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {order.status === 'processing' && (
            <>
              <Link
                href={`/nimda-pro-sumit/orders/${orderId}/invoice`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">print</span>
                Print Invoice
              </Link>
              <button
                onClick={handleReadyToShip}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
              >
                <span className="material-symbols-outlined text-lg">local_shipping</span>
                Ready to Ship
              </button>
            </>
          )}
          {order.status === 'pending' && (
            <>
              <button
                onClick={handleCancelOrder}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-500/20 text-red-500 font-bold text-sm hover:bg-red-500/10 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">cancel</span>
                Cancel Order
              </button>
              <button
                onClick={handleAcceptOrder}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
              >
                <span className="material-symbols-outlined text-lg">check_circle</span>
                Accept Order
              </button>
            </>
          )}
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1: Order Items */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-lg">Order Items ({order.items.length})</h3>
              <span className="text-xs text-gray-500 font-medium">Shipment 1 of 1</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3 text-center">Qty</th>
                    <th className="px-6 py-3 text-right">Price</th>
                    <th className="px-6 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden">
                            <img
                              alt={item.name}
                              className="w-full h-full object-cover"
                              src={item.image}
                            />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500 font-mono">SKU: {item.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-medium">{item.quantity}</td>
                      <td className="px-6 py-4 text-right font-medium">
                        ₹{item.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-bold">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Internal Notes */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">edit_note</span>
                Internal Notes
              </h3>
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="text-xs font-bold text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Note
              </button>
            </div>
            <div className="space-y-4">
              {order.notes.map((note, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-blue-600">{note.author}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-tighter">
                      {new Date(note.timestamp).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{note.message}</p>
                </div>
              ))}
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full mt-2 bg-transparent border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500 p-3 border"
                placeholder="Type a new internal note..."
                rows={2}
              />
            </div>
          </section>
        </div>

        {/* Column 2 & 3: Info Cards */}
        <div className="flex flex-col gap-6">
          {/* Shipping & Customer Info */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">local_shipping</span>
              Shipping & Customer
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gray-400 text-xl mt-1">
                  location_on
                </span>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Address
                  </p>
                  <p className="text-sm font-medium leading-relaxed">
                    {order.shippingAddress.name}
                    <br />
                    {order.shippingAddress.address}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.pincode}
                    <br />
                    {order.shippingAddress.country}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gray-400 text-xl mt-1">call</span>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Phone
                  </p>
                  <p className="text-sm font-medium">{order.customerPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gray-400 text-xl mt-1">mail</span>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <a
                    className="text-sm font-medium text-blue-600 hover:underline"
                    href={`mailto:${order.customerEmail}`}
                  >
                    {order.customerEmail}
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Details */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">account_balance_wallet</span>
              Payment Details
            </h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-500">check_circle</span>
                  <span className="text-sm font-bold text-green-600">
                    Paid via {order.paymentMethod}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold">{order.transactionId}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    TXN ID
                  </p>
                  <p className="text-xs font-mono font-medium">#{order.transactionId}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Gateway
                  </p>
                  <p className="text-xs font-medium">{order.gateway}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">₹{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium text-green-500">
                  {order.shipping === 0 ? 'FREE' : `₹${order.shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax (GST 18%)</span>
                <span className="font-medium">₹{order.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-black pt-2">
                <span>Total</span>
                <span>₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </section>

          {/* Shipping Map/Preview Placeholder */}
          <div className="h-48 rounded-xl bg-gray-200 overflow-hidden relative border border-gray-200 shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
              <span className="material-symbols-outlined text-4xl text-gray-400">map</span>
              <span className="text-xs font-bold text-gray-500 uppercase">
                Fulfillment Route: {order.shippingAddress.city} Hub
              </span>
            </div>
            <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded text-[10px] font-bold shadow-sm">
              GEO-LOC: {order.shippingAddress.pincode}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

