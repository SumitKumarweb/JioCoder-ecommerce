import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Total orders count
    const totalOrders = await Order.countDocuments();

    // Total revenue (sum of all completed/paid orders)
    const totalRevenueResult = await Order.aggregate([
      {
        $match: {
          $or: [
            { status: 'COMPLETED' },
            { status: 'SHIPPED' },
            { paymentStatus: 'PAID' }
          ]
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // Pending orders count
    const pendingOrders = await Order.countDocuments({ status: 'PENDING' });

    // Completed orders count
    const completedOrders = await Order.countDocuments({ status: 'COMPLETED' });

    // Total unique customers (by email)
    const uniqueCustomers = await Order.distinct('customerEmail');
    const totalCustomers = uniqueCustomers.length;

    // Orders in last 30 days
    const ordersLast30Days = await Order.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Revenue in last 30 days
    const revenueLast30DaysResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          $or: [
            { status: 'COMPLETED' },
            { status: 'SHIPPED' },
            { paymentStatus: 'PAID' }
          ]
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);
    const revenueLast30Days = revenueLast30DaysResult[0]?.total || 0;

    // Orders in last 7 days
    const ordersLast7Days = await Order.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Revenue in last 7 days
    const revenueLast7DaysResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          $or: [
            { status: 'COMPLETED' },
            { status: 'SHIPPED' },
            { paymentStatus: 'PAID' }
          ]
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);
    const revenueLast7Days = revenueLast7DaysResult[0]?.total || 0;

    // Previous period (30-60 days ago) for comparison
    const ordersPrevious30Days = await Order.countDocuments({
      createdAt: { $gte: lastMonth, $lt: thirtyDaysAgo }
    });

    const revenuePrevious30DaysResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonth, $lt: thirtyDaysAgo },
          $or: [
            { status: 'COMPLETED' },
            { status: 'SHIPPED' },
            { paymentStatus: 'PAID' }
          ]
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);
    const revenuePrevious30Days = revenuePrevious30DaysResult[0]?.total || 0;

    // Calculate percentage changes
    const ordersChange = ordersPrevious30Days > 0
      ? ((ordersLast30Days - ordersPrevious30Days) / ordersPrevious30Days * 100).toFixed(1)
      : ordersLast30Days > 0 ? '100' : '0';

    const revenueChange = revenuePrevious30Days > 0
      ? ((revenueLast30Days - revenuePrevious30Days) / revenuePrevious30Days * 100).toFixed(1)
      : revenueLast30Days > 0 ? '100' : '0';

    // Recent orders (last 5)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber customerName customerEmail items total status createdAt')
      .lean();

    // Live sales (pending/paid orders from last 24 hours)
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const liveSales = await Order.find({
      createdAt: { $gte: last24Hours },
      $or: [
        { status: 'PENDING' },
        { status: 'PAID' },
        { paymentStatus: 'PAID' }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber customerName customerEmail items total status createdAt')
      .lean();

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusCounts: Record<string, number> = {};
    ordersByStatus.forEach((item: any) => {
      statusCounts[item._id] = item.count;
    });

    return NextResponse.json({
      stats: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
        totalCustomers,
        ordersLast30Days,
        revenueLast30Days,
        ordersLast7Days,
        revenueLast7Days,
        ordersChange: parseFloat(ordersChange),
        revenueChange: parseFloat(revenueChange),
        statusCounts,
      },
      recentOrders: recentOrders.map(order => ({
        _id: order._id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        productName: order.items?.[0]?.name || `${order.items?.length || 0} item(s)`,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
      })),
      liveSales: liveSales.map(order => ({
        _id: order._id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        productName: order.items?.[0]?.name || `${order.items?.length || 0} item(s)`,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    console.error("Admin GET /dashboard failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

