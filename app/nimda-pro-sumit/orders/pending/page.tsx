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

// Map MongoDB status to admin display status
const mapStatus = (mongoStatus: string): Order['status'] => {
  const statusMap: Record<string, Order['status']> = {
    'PENDING': 'pending',
    'PAID': 'processing',
    'SHIPPED': 'shipped',
    'COMPLETED': 'delivered',
    'CANCELLED': 'cancelled',
  };
  return statusMap[mongoStatus] || 'pending';
};

// Map admin display status to MongoDB status
const mapStatusToMongo = (adminStatus: Order['status']): string => {
  const statusMap: Record<Order['status'], string> = {
    'pending': 'PENDING',
    'processing': 'PAID',
    'shipped': 'SHIPPED',
    'delivered': 'COMPLETED',
    'cancelled': 'CANCELLED',
  };
  return statusMap[adminStatus] || 'PENDING';
};

export default function PendingOrdersPage() {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPendingOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/orders?status=PENDING');
        if (!response.ok) {
          throw new Error('Failed to fetch pending orders');
        }
        const data = await response.json();
        
        // Transform MongoDB orders to admin format
        const transformedOrders: Order[] = data.map((order: any) => {
          const shippingAddr = order.shippingAddress || {};
          const shippingAddressStr = shippingAddr.address
            ? `${shippingAddr.address}${shippingAddr.locality ? `, ${shippingAddr.locality}` : ''}, ${shippingAddr.city || ''} - ${shippingAddr.pinCode || ''}`
            : 'Address not provided';

          return {
            id: order._id,
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            products: order.items.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
            totalAmount: order.total,
            status: mapStatus(order.status),
            paymentStatus: (order.paymentStatus || 'PENDING').toLowerCase() as 'pending' | 'paid' | 'refunded',
            shippingAddress: shippingAddressStr,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
          };
        });

        setPendingOrders(transformedOrders);
      } catch (error) {
        console.error('Failed to load pending orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPendingOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      const mongoStatus = mapStatusToMongo(newStatus);
      
      // Update via API
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: mongoStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Remove from pending list if status changed from pending
      if (newStatus !== 'pending') {
        setPendingOrders(pendingOrders.filter(order => order.id !== orderId));
      } else {
        // Update local state
        setPendingOrders(
          pendingOrders.map((order) =>
            order.id === orderId
              ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
              : order
          )
        );
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status. Please try again.');
    }
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

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading pending orders...</p>
        </div>
      )}

      {/* Pending Orders Table */}
      {!isLoading && (
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
      )}

      {!isLoading && filteredOrders.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">pending</span>
          <p className="text-gray-500 text-lg font-semibold mb-2">No Pending Orders</p>
          <p className="text-gray-400">All orders have been processed or there are no orders matching your search.</p>
        </div>
      )}
    </div>
  );
}

