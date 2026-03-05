'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface StatCard {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
  color: string;
}

interface OrderRow {
  id: string;
  orderNumber?: string;
  customerName: string;
  productName: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  date: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([]);
  const [liveSales, setLiveSales] = useState<OrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/admin/dashboard');
        if (!res.ok) {
          throw new Error(`Failed to fetch dashboard data: ${res.status}`);
        }
        const data = await res.json();

        // Format stats
        const formattedStats: StatCard[] = [
          {
            title: 'Total Orders',
            value: data.stats.totalOrders.toLocaleString(),
            change: data.stats.ordersChange > 0 ? `+${data.stats.ordersChange}%` : `${data.stats.ordersChange}%`,
            changeType: data.stats.ordersChange >= 0 ? 'positive' : 'negative',
            icon: 'shopping_bag',
            color: 'bg-blue-500',
          },
          {
            title: 'Total Revenue',
            value: `₹${data.stats.totalRevenue.toLocaleString('en-IN')}`,
            change: data.stats.revenueChange > 0 ? `+${data.stats.revenueChange}%` : `${data.stats.revenueChange}%`,
            changeType: data.stats.revenueChange >= 0 ? 'positive' : 'negative',
            icon: 'payments',
            color: 'bg-green-500',
          },
          {
            title: 'Total Customers',
            value: data.stats.totalCustomers.toLocaleString(),
            change: undefined,
            changeType: 'neutral',
            icon: 'people',
            color: 'bg-purple-500',
          },
          {
            title: 'Pending Orders',
            value: data.stats.pendingOrders.toLocaleString(),
            change: undefined,
            changeType: 'neutral',
            icon: 'pending',
            color: 'bg-yellow-500',
          },
          {
            title: 'Completed Orders',
            value: data.stats.completedOrders.toLocaleString(),
            change: undefined,
            changeType: 'neutral',
            icon: 'check_circle',
            color: 'bg-emerald-500',
          },
          {
            title: 'Revenue (30 days)',
            value: `₹${data.stats.revenueLast30Days.toLocaleString('en-IN')}`,
            change: undefined,
            changeType: 'neutral',
            icon: 'trending_up',
            color: 'bg-indigo-500',
          },
        ];

        setStats(formattedStats);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Fallback to empty stats
        setStats([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await fetch('/api/admin/dashboard');
        if (!res.ok) {
          throw new Error(`Failed to fetch dashboard data: ${res.status}`);
        }
        const data = await res.json();

        // Map recent orders
        const mappedRecent: OrderRow[] = data.recentOrders?.map((order: any) => ({
          id: order._id,
          orderNumber: order.orderNumber,
          customerName: order.customerName || order.customerEmail || 'Guest',
          productName: order.productName,
          amount: order.total,
          status: order.status,
          date: order.createdAt,
        })) || [];

        // Map live sales
        const mappedLive: OrderRow[] = data.liveSales?.map((order: any) => ({
          id: order._id,
          orderNumber: order.orderNumber,
          customerName: order.customerName || order.customerEmail || 'Guest',
          productName: order.productName,
          amount: order.total,
          status: order.status,
          date: order.createdAt,
        })) || [];

        setRecentOrders(mappedRecent);
        setLiveSales(mappedLive);
      } catch (error) {
        console.error('Failed to load orders for dashboard', error);
      }
    };

    loadOrders();
  }, []);

  const getStatusColor = (status: OrderRow['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAID':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      )}

      {/* Stats Grid */}
      {!isLoading && (
        <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.change && (
                  <p
                    className={`text-sm mt-1 ${
                      stat.changeType === 'positive'
                        ? 'text-green-600'
                        : stat.changeType === 'negative'
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {stat.change} from last period
                  </p>
                )}
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <span className="material-symbols-outlined text-white text-2xl">
                  {stat.icon}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Link
              href="/nimda-pro-sumit/orders"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </Link>
          </div>
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
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link href={`/nimda-pro-sumit/orders/${order.id}`} className="text-blue-600 hover:text-blue-800">
                        {order.orderNumber || order.id.slice(-8)}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{order.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Sales */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500">radio_button_checked</span>
              <h3 className="text-lg font-semibold text-gray-900">Live Sales</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {liveSales.length > 0 ? (
              liveSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{sale.customerName}</p>
                    <p className="text-sm text-gray-500">{sale.productName}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(sale.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{sale.amount.toLocaleString('en-IN')}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                      <span className="material-symbols-outlined text-sm">trending_up</span>
                      Live
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No live sales at the moment</p>
            )}
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}

