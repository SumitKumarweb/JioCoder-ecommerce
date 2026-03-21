import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CustomOrder from '@/models/CustomOrder';

// POST — create a new custom print order (public)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      userId,
      designImageUrl,
      designImageName,
      size,
      material,
      overlayText,
      overlayFont,
      overlayColor,
      price,
      quantity,
      total,
      shippingAddress,
    } = body;

    if (!customerName || !customerEmail || !designImageUrl || !size || !price) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const order = await CustomOrder.create({
      customerName: String(customerName).trim(),
      customerEmail: String(customerEmail).trim().toLowerCase(),
      customerPhone: customerPhone ? String(customerPhone).trim() : undefined,
      userId: userId || undefined,
      designImageUrl,
      designImageName: designImageName || 'custom-design',
      size,
      material: material || 'Stitched Edge',
      overlayText: overlayText || undefined,
      overlayFont: overlayFont || 'Inter',
      overlayColor: overlayColor || '#ffffff',
      price: Number(price),
      quantity: Number(quantity) || 1,
      total: Number(total) || Number(price),
      shippingAddress: shippingAddress || undefined,
    });

    return NextResponse.json({ success: true, orderNumber: order.orderNumber, id: order._id }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/studio/orders failed:', error);
    return NextResponse.json({ message: error.message || 'Failed to create order' }, { status: 500 });
  }
}

// GET — admin fetch all custom orders
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = Number(searchParams.get('limit')) || 100;

    const query: Record<string, unknown> = {};
    if (status && status !== 'ALL') query.status = status;

    const orders = await CustomOrder.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('GET /api/studio/orders failed:', error);
    return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 });
  }
}

// PATCH — admin update order status / notes
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, status, adminNotes } = body;

    if (!id) return NextResponse.json({ message: 'Order ID required' }, { status: 400 });

    const update: Record<string, unknown> = {};
    if (status) update.status = status;
    if (adminNotes !== undefined) update.adminNotes = adminNotes;

    const updated = await CustomOrder.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!updated) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('PATCH /api/studio/orders failed:', error);
    return NextResponse.json({ message: 'Failed to update order' }, { status: 500 });
  }
}
