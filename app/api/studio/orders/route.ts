import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import CustomOrder from '@/models/CustomOrder';

const COP_ORDER_RE = /^COP\d{6}$/;

/** Next COP###### after the highest existing (not countDocuments — avoids gaps / races). */
async function nextStudioOrderNumber(): Promise<string> {
  const last = await CustomOrder.findOne({ orderNumber: { $regex: COP_ORDER_RE } })
    .sort({ orderNumber: -1 })
    .select('orderNumber')
    .lean();

  let seq = 1001;
  if (last?.orderNumber && typeof last.orderNumber === 'string') {
    const parsed = parseInt(last.orderNumber.slice(3), 10);
    if (!Number.isNaN(parsed)) seq = parsed + 1;
  }
  return `COP${String(seq).padStart(6, '0')}`;
}

function isDuplicateOrderNumberError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: number }).code === 11000
  );
}

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

    const uid =
      userId && mongoose.isValidObjectId(String(userId))
        ? new mongoose.Types.ObjectId(String(userId))
        : undefined;

    const payload = {
      customerName: String(customerName).trim(),
      customerEmail: String(customerEmail).trim().toLowerCase(),
      customerPhone: customerPhone ? String(customerPhone).trim() : undefined,
      userId: uid,
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
    };

    const MAX_ATTEMPTS = 10;
    let order: mongoose.Document & { orderNumber: string; _id: mongoose.Types.ObjectId } | null = null;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const orderNumber = await nextStudioOrderNumber();
      try {
        order = (await CustomOrder.create({ ...payload, orderNumber })) as mongoose.Document & {
          orderNumber: string;
          _id: mongoose.Types.ObjectId;
        };
        break;
      } catch (e) {
        if (isDuplicateOrderNumberError(e) && attempt < MAX_ATTEMPTS - 1) continue;
        throw e;
      }
    }

    if (!order) {
      return NextResponse.json({ message: 'Could not assign order number. Try again.' }, { status: 503 });
    }

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
