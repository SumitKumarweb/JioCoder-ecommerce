import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Coupon from '@/models/Coupon';

// GET /api/admin/coupons — list all coupons
export async function GET() {
  try {
    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(coupons);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST /api/admin/coupons — create coupon
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const required = ['code', 'description', 'type', 'value', 'validFrom', 'validUntil'];
    for (const field of required) {
      if (!body[field] && body[field] !== 0) {
        return NextResponse.json({ message: `${field} is required` }, { status: 400 });
      }
    }

    if (body.type === 'PERCENTAGE' && (body.value < 1 || body.value > 100)) {
      return NextResponse.json({ message: 'Percentage must be between 1 and 100' }, { status: 400 });
    }

    const coupon = await Coupon.create({
      code: String(body.code).toUpperCase().trim(),
      description: body.description,
      type: body.type,
      value: Number(body.value),
      scope: body.scope || 'ALL',
      applicableProductIds: body.applicableProductIds || [],
      minOrderValue: Number(body.minOrderValue) || 0,
      maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : undefined,
      usageLimit: Number(body.usageLimit) || 0,
      perUserLimit: Number(body.perUserLimit) || 0,
      validFrom: new Date(body.validFrom),
      validUntil: new Date(body.validUntil),
      isActive: body.isActive !== false,
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ message: 'Coupon code already exists' }, { status: 409 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT /api/admin/coupons — update coupon
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ message: 'Coupon ID is required' }, { status: 400 });
    }

    if (updates.code) {
      updates.code = String(updates.code).toUpperCase().trim();
    }
    if (updates.validFrom) updates.validFrom = new Date(updates.validFrom);
    if (updates.validUntil) updates.validUntil = new Date(updates.validUntil);
    if (updates.value !== undefined) updates.value = Number(updates.value);
    if (updates.minOrderValue !== undefined) updates.minOrderValue = Number(updates.minOrderValue);
    if (updates.usageLimit !== undefined) updates.usageLimit = Number(updates.usageLimit);
    if (updates.perUserLimit !== undefined) updates.perUserLimit = Number(updates.perUserLimit);
    if (updates.maxDiscount !== undefined) {
      updates.maxDiscount = updates.maxDiscount ? Number(updates.maxDiscount) : undefined;
    }

    const updated = await Coupon.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
    if (!updated) {
      return NextResponse.json({ message: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ message: 'Coupon code already exists' }, { status: 409 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/coupons?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ message: 'Coupon ID is required' }, { status: 400 });
    }
    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
