'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export default function PendingOrdersPage() {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Mock data - replace with API call
    const allOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'ORD-001',
        customerName: 'Rahul Sharma',
        customerEmail: 'rahul@example.com',
        products: [
          { name: 'Keychron K2 Keyboard', quantity: 1, price: 7499 },
          { name: 'Gaming Mouse', quantity: 1, price: 1999 },
        ],
        totalAmount: 9498,
        status: 'processing',
        paymentStatus: 'paid',
        shippingAddress: 'Apartment 402, Green Heights, Powai, Mumbai - 400076',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T11:00:00Z',
      },
      {
        id: '2',
        orderNumber: 'ORD-002',
        customerName: 'Priya Patel',
        customerEmail: 'priya@example.com',
        products: [{ name: 'Logitech MX Keys', quantity: 1, price: 12995 }],
        totalAmount: 12995,
        status: 'shipped',
        paymentStatus: 'paid',
        shippingAddress: '123 Main Street, Bangalore - 560001',
        createdAt: '2024-01-14T14:20:00Z',
        updatedAt: '2024-01-15T09:00:00Z',
      },
      {
        id: '3',
        orderNumber: 'ORD-003',
        customerName: 'Amit Kumar',
        customerEmail: 'amit@example.com',
        products: [{ name: 'Custom Keycaps Set', quantity: 2, price: 2499 }],
        totalAmount: 4998,
        status: 'delivered',
        paymentStatus: 'paid',
        shippingAddress: '456 Park Avenue, Delhi - 110001',
        createdAt: '2024-01-13T16:45:00Z',
        updatedAt: '2024-01-14T10:30:00Z',
      },
      {
        id: '4',
        orderNumber: 'ORD-004',
        customerName: 'Sneha Reddy',
        customerEmail: 'sneha@example.com',
        products: [{ name: 'Mechanical Keyboard', quantity: 1, price: 8999 }],
        totalAmount: 8999,
        status: 'pending',
        paymentStatus: 'pending',
        shippingAddress: '789 Tech Park, Hyderabad - 500032',
        createdAt: '2024-01-15T08:15:00Z',
        updatedAt: '2024-01-15T08:15:00Z',
      },
      {
        id: '5',
        orderNumber: 'ORD-005',
        customerName: 'Vikram Singh',
        customerEmail: 'vikram@example.com',
        products: [{ name: 'Wireless Mouse', quantity: 2, price: 1999 }],
        totalAmount: 3998,
        status: 'pending',
        paymentStatus: 'pending',
        shippingAddress: '101 Tech Valley, Pune - 411001',
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z',
      },
      {
        id: '6',
        orderNumber: 'ORD-006',
        customerName: 'Anjali Mehta',
        customerEmail: 'anjali@example.com',
        products: [{ name: 'Keyboard Stand', quantity: 1, price: 1499 }],
        totalAmount: 1499,
        status: 'pending',
        paymentStatus: 'paid',
        shippingAddress: '202 Innovation Hub, Chennai - 600001',
        createdAt: '2024-01-15T14:30:00Z',
        updatedAt: '2024-01-15T14:30:00Z',
      },
    ];

    // Filter only pending orders
    const pending = allOrders.filter((order) => order.status === 'pending');
    setPendingOrders(pending);
  }, []);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setPendingOrders(
      pendingOrders
        .map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
            : order
        )
        .filter((order) => order.status === 'pending') // Remove if status changed from pending
    );
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = pendingOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalPendingAmount = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Pending Orders</h1>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}
            </span>
          </div>
          <p className="text-gray-600 mt-1">Orders awaiting processing or payment confirmation</p>
        </div>
        <Link
          href="/nimda-pro-sumit/orders"
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          View All Orders
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{filteredOrders.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <span className="material-symbols-outlined text-yellow-600 text-2xl">pending</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{totalPendingAmount.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <span className="material-symbols-outlined text-blue-600 text-2xl">payments</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Awaiting Payment</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredOrders.filter((o) => o.paymentStatus === 'pending').length}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <span className="material-symbols-outlined text-orange-600 text-2xl">
                payment
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search pending orders by order number, customer name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Pending Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.products.map((p, idx) => (
                        <div key={idx}>
                          {p.name} (x{p.quantity})
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{order.totalAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as Order['status'])
                        }
                        className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-300 bg-white cursor-pointer hover:bg-gray-50"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <Link
                        href={`/nimda-pro-sumit/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">pending</span>
          <p className="text-gray-500 text-lg font-semibold mb-2">No Pending Orders</p>
          <p className="text-gray-400">All orders have been processed or there are no orders matching your search.</p>
        </div>
      )}
    </div>
  );
}

