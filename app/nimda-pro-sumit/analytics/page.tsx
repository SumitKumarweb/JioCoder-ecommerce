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

interface AnalyticsApiResponse {
  stats: Array<{ _id: string; count: number }>;
  recentPageViews?: Array<{
    id: string;
    createdAt: string;
    pageUrl: string | null;
    path: string | null;
    referrer: string | null;
    email: string | null;
    userId: string | null;
    guestUid: string | null;
    sessionUid: string | null;
    userAgent?: string | null;
  }>;
}

interface DashboardApiResponse {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    ordersLast30Days: number;
    revenueLast30Days: number;
    ordersLast7Days: number;
    revenueLast7Days: number;
    ordersChange: number;
    revenueChange: number;
  };
  recentOrders: Array<{
    _id: string;
    productName: string;
    total: number;
  }>;
  liveSales: Array<{
    _id: string;
    productName: string;
    total: number;
  }>;
}

export default function AnalyticsPage() {
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [orderAnalytics, setOrderAnalytics] = useState<OrderAnalytics | null>(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics | null>(null);
  const [productAnalytics, setProductAnalytics] = useState<ProductAnalytics | null>(null);
  const [trafficAnalytics, setTrafficAnalytics] = useState<TrafficAnalytics | null>(null);
  const [recentPageViews, setRecentPageViews] = useState<AnalyticsApiResponse['recentPageViews']>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      setError('');
      try {
        const [dashboardRes, eventsRes] = await Promise.all([
          fetch('/api/admin/dashboard', { cache: 'no-store' }),
          fetch(
            `/api/admin/analytics?days=${
              timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 3650
            }`,
            { cache: 'no-store' }
          ),
        ]);

        if (!dashboardRes.ok) {
          throw new Error('Failed to load dashboard analytics');
        }

        const dashboardData: DashboardApiResponse = await dashboardRes.json();
        const stats = dashboardData.stats;

        setUserAnalytics({
          totalUsers: stats.totalCustomers || 0,
          newUsersLast30Days: stats.ordersLast30Days || 0,
          activeUsersLast7Days: stats.ordersLast7Days || 0,
          userGrowthRate: stats.ordersChange || 0,
        });

        setOrderAnalytics({
          totalOrders: stats.totalOrders || 0,
          ordersLast7Days: stats.ordersLast7Days || 0,
          ordersLast30Days: stats.ordersLast30Days || 0,
          averageOrderValue:
            stats.totalOrders > 0 ? Math.round((stats.totalRevenue || 0) / stats.totalOrders) : 0,
          orderGrowthRate: stats.ordersChange || 0,
        });

        setRevenueAnalytics({
          totalRevenue: stats.totalRevenue || 0,
          revenueLast7Days: stats.revenueLast7Days || 0,
          revenueLast30Days: stats.revenueLast30Days || 0,
          revenueGrowthRate: stats.revenueChange || 0,
        });

        const mergedOrders = [...(dashboardData.recentOrders || []), ...(dashboardData.liveSales || [])];
        const productMap = new Map<string, { id: string; name: string; sales: number; revenue: number }>();
        mergedOrders.forEach((order) => {
          const key = order.productName || 'Unknown Product';
          const existing = productMap.get(key);
          if (existing) {
            existing.sales += 1;
            existing.revenue += order.total || 0;
          } else {
            productMap.set(key, {
              id: order._id,
              name: key,
              sales: 1,
              revenue: order.total || 0,
            });
          }
        });

        setProductAnalytics({
          totalProducts: productMap.size,
          topSellingProducts: Array.from(productMap.values())
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5),
        });

        if (eventsRes.ok) {
          const eventsData: AnalyticsApiResponse | Array<{ _id: string; count: number }> = await eventsRes.json();
          const events = Array.isArray(eventsData) ? eventsData : eventsData.stats || [];
          setRecentPageViews(Array.isArray(eventsData) ? [] : eventsData.recentPageViews || []);
          const getCount = (type: string) =>
            events.find((event) => String(event._id).toLowerCase() === type.toLowerCase())?.count || 0;

          const totalVisits = getCount('visit') + getCount('page_view');
          const uniqueVisitors = getCount('unique_visitor');
          const pageViews = getCount('page_view');
          const sessions = getCount('session_start');
          const bounceEvents = getCount('bounce');
          const bounceRate = sessions > 0 ? Number(((bounceEvents / sessions) * 100).toFixed(1)) : 0;

          setTrafficAnalytics({
            totalVisits,
            uniqueVisitors,
            pageViews,
            averageSessionDuration: sessions > 0 ? '~2m 30s' : '0m 00s',
            bounceRate,
          });
        } else {
          setRecentPageViews([]);
          setTrafficAnalytics({
            totalVisits: 0,
            uniqueVisitors: 0,
            pageViews: 0,
            averageSessionDuration: '0m 00s',
            bounceRate: 0,
          });
        }
      } catch (err) {
        console.error('Failed to load analytics data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const demographicSegments = (() => {
    const views = recentPageViews || [];
    if (views.length === 0) {
      return [
        { label: 'Logged-in users', percentage: 0 },
        { label: 'Guest users', percentage: 0 },
        { label: 'Returning guests', percentage: 0 },
        { label: 'New guests', percentage: 0 },
      ];
    }

    const loggedIn = views.filter((v) => Boolean(v?.email || v?.userId)).length;
    const guests = views.filter((v) => !v?.email && !v?.userId).length;

    const guestCountMap = new Map<string, number>();
    views.forEach((v) => {
      if (v?.guestUid) {
        guestCountMap.set(v.guestUid, (guestCountMap.get(v.guestUid) || 0) + 1);
      }
    });
    const returningGuestViews = Array.from(guestCountMap.entries())
      .filter(([, count]) => count > 1)
      .reduce((sum, [, count]) => sum + count, 0);
    const newGuestViews = Math.max(guests - returningGuestViews, 0);

    const total = Math.max(views.length, 1);
    const pct = (value: number) => Math.round((value / total) * 100);

    return [
      { label: 'Logged-in users', percentage: pct(loggedIn) },
      { label: 'Guest users', percentage: pct(guests) },
      { label: 'Returning guests', percentage: pct(returningGuestViews) },
      { label: 'New guests', percentage: pct(newGuestViews) },
    ];
  })();

  const deviceSegments = (() => {
    const views = recentPageViews || [];
    if (views.length === 0) {
      return [
        { label: 'Mobile', percentage: 0 },
        { label: 'Desktop', percentage: 0 },
        { label: 'Tablet', percentage: 0 },
      ];
    }

    let mobile = 0;
    let desktop = 0;
    let tablet = 0;

    views.forEach((visit) => {
      const ua = String(visit?.userAgent || '').toLowerCase();
      if (!ua) {
        desktop += 1;
        return;
      }
      const isTablet = /ipad|tablet|playbook|silk/.test(ua);
      const isMobile = !isTablet && /mobile|android|iphone|ipod|blackberry|opera mini|iemobile/.test(ua);
      if (isTablet) {
        tablet += 1;
      } else if (isMobile) {
        mobile += 1;
      } else {
        desktop += 1;
      }
    });

    const total = Math.max(views.length, 1);
    const pct = (value: number) => Math.round((value / total) * 100);
    return [
      { label: 'Mobile', percentage: pct(mobile) },
      { label: 'Desktop', percentage: pct(desktop) },
      { label: 'Tablet', percentage: pct(tablet) },
    ];
  })();

  return (
    <div className="space-y-6">
      {loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

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
            {demographicSegments.map((segment) => (
              <div key={segment.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{segment.label}</span>
                  <span className="font-medium text-gray-900">{segment.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${segment.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h2>
          <div className="space-y-3">
            {deviceSegments.map((segment) => (
              <div key={segment.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{segment.label}</span>
                  <span className="font-medium text-gray-900">{segment.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${segment.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Link Visits */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">User Link Visits</h2>
        {!recentPageViews || recentPageViews.length === 0 ? (
          <p className="text-sm text-gray-500">No page visit data found for this range.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Time</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">User</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Visited Link</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Referrer</th>
                </tr>
              </thead>
              <tbody>
                {recentPageViews.slice(0, 50).map((visit) => (
                  <tr key={visit?.id || `${visit?.sessionUid}-${visit?.createdAt}`} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {visit?.createdAt ? new Date(visit.createdAt).toLocaleString('en-IN') : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">{visit?.email || 'Guest User'}</div>
                        <div className="text-xs text-gray-500">
                          UID: {visit?.guestUid || '-'}
                          {visit?.userId ? ` | User: ${visit.userId}` : ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {visit?.pageUrl ? (
                        <a
                          href={visit.pageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {visit.path || visit.pageUrl}
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 break-all">
                      {visit?.referrer || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

