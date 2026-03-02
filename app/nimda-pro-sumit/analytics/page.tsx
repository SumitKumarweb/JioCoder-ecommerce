'use client';

import { useState, useEffect } from 'react';

interface UserAnalytics {
  totalUsers: number;
  newUsersLast30Days: number;
  activeUsersLast7Days: number;
  userGrowthRate: number;
}

interface OrderAnalytics {
  totalOrders: number;
  ordersLast7Days: number;
  ordersLast30Days: number;
  averageOrderValue: number;
  orderGrowthRate: number;
}

interface RevenueAnalytics {
  totalRevenue: number;
  revenueLast7Days: number;
  revenueLast30Days: number;
  revenueGrowthRate: number;
}

interface ProductAnalytics {
  totalProducts: number;
  topSellingProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
}

interface TrafficAnalytics {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: number;
  averageSessionDuration: string;
  bounceRate: number;
}

export default function AnalyticsPage() {
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [orderAnalytics, setOrderAnalytics] = useState<OrderAnalytics | null>(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics | null>(null);
  const [productAnalytics, setProductAnalytics] = useState<ProductAnalytics | null>(null);
  const [trafficAnalytics, setTrafficAnalytics] = useState<TrafficAnalytics | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    // Mock data - replace with actual API calls
    setUserAnalytics({
      totalUsers: 12458,
      newUsersLast30Days: 1234,
      activeUsersLast7Days: 3456,
      userGrowthRate: 12.5,
    });

    setOrderAnalytics({
      totalOrders: 8923,
      ordersLast7Days: 456,
      ordersLast30Days: 1890,
      averageOrderValue: 5123,
      orderGrowthRate: 15.3,
    });

    setRevenueAnalytics({
      totalRevenue: 45678900,
      revenueLast7Days: 2345678,
      revenueLast30Days: 9876543,
      revenueGrowthRate: 18.7,
    });

    setProductAnalytics({
      totalProducts: 156,
      topSellingProducts: [
        { id: '1', name: 'Keychron K2 Keyboard', sales: 234, revenue: 1754166 },
        { id: '2', name: 'Logitech MX Keys', sales: 189, revenue: 2456055 },
        { id: '3', name: 'Gaming Mouse Pro', sales: 156, revenue: 545844 },
        { id: '4', name: 'Custom Keycaps Set', sales: 134, revenue: 334866 },
        { id: '5', name: 'Mechanical Keyboard', sales: 98, revenue: 881902 },
      ],
    });

    setTrafficAnalytics({
      totalVisits: 45678,
      uniqueVisitors: 34256,
      pageViews: 123456,
      averageSessionDuration: '4m 32s',
      bounceRate: 32.5,
    });
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track and analyze user behavior and performance</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      {/* User Analytics */}
      {userAnalytics && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {userAnalytics.totalUsers.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">New Users (30 days)</p>
              <p className="text-2xl font-bold text-gray-900">
                {userAnalytics.newUsersLast30Days.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Users (7 days)</p>
              <p className="text-2xl font-bold text-gray-900">
                {userAnalytics.activeUsersLast7Days.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Growth Rate</p>
              <p className="text-2xl font-bold text-green-600">
                +{userAnalytics.userGrowthRate}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order & Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {orderAnalytics && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Analytics</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orderAnalytics.totalOrders.toLocaleString()}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Last 7 days</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {orderAnalytics.ordersLast7Days}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Last 30 days</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {orderAnalytics.ordersLast30Days}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Order Value</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatCurrency(orderAnalytics.averageOrderValue)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Growth Rate</p>
                <p className="text-xl font-semibold text-green-600">
                  +{orderAnalytics.orderGrowthRate}%
                </p>
              </div>
            </div>
          </div>
        )}

        {revenueAnalytics && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Analytics</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(revenueAnalytics.totalRevenue)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Last 7 days</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatCurrency(revenueAnalytics.revenueLast7Days)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Last 30 days</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatCurrency(revenueAnalytics.revenueLast30Days)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Growth Rate</p>
                <p className="text-xl font-semibold text-green-600">
                  +{revenueAnalytics.revenueGrowthRate}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Traffic Analytics */}
      {trafficAnalytics && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Visits</p>
              <p className="text-xl font-bold text-gray-900">
                {trafficAnalytics.totalVisits.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Unique Visitors</p>
              <p className="text-xl font-bold text-gray-900">
                {trafficAnalytics.uniqueVisitors.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Page Views</p>
              <p className="text-xl font-bold text-gray-900">
                {trafficAnalytics.pageViews.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Session</p>
              <p className="text-xl font-bold text-gray-900">
                {trafficAnalytics.averageSessionDuration}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Bounce Rate</p>
              <p className="text-xl font-bold text-gray-900">
                {trafficAnalytics.bounceRate}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Selling Products */}
      {productAnalytics && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productAnalytics.topSellingProducts.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.sales} units</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(product.revenue)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Additional Analytics Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Demographics</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Age 18-24</span>
                <span className="font-medium text-gray-900">32%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Age 25-34</span>
                <span className="font-medium text-gray-900">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Age 35-44</span>
                <span className="font-medium text-gray-900">18%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Age 45+</span>
                <span className="font-medium text-gray-900">5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Mobile</span>
                <span className="font-medium text-gray-900">58%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '58%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Desktop</span>
                <span className="font-medium text-gray-900">32%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Tablet</span>
                <span className="font-medium text-gray-900">10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

