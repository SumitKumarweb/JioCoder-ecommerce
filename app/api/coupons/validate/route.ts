import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Coupon from '@/models/Coupon';

export interface CouponValidateResult {
  valid: boolean;
  code?: string;
  type?: 'PERCENTAGE' | 'FIXED' | 'VOUCHER';
  value?: number;
  discountAmount?: number;
  description?: string;
  error?: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { code, cartTotal, cartItemIds } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json<CouponValidateResult>(
        { valid: false, error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return NextResponse.json<CouponValidateResult>(
        { valid: false, error: 'Invalid or expired coupon code' },
        { status: 404 }
      );
    }

    const now = new Date();
    if (now < coupon.validFrom) {
      return NextResponse.json<CouponValidateResult>(
        { valid: false, error: 'This coupon is not active yet' },
        { status: 400 }
      );
    }
    if (now > coupon.validUntil) {
      return NextResponse.json<CouponValidateResult>(
        { valid: false, error: 'This coupon has expired' },
        { status: 400 }
      );
    }

    if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json<CouponValidateResult>(
        { valid: false, error: 'This coupon has reached its usage limit' },
        { status: 400 }
      );
    }

    const orderTotal = typeof cartTotal === 'number' ? cartTotal : 0;
    if (coupon.minOrderValue > 0 && orderTotal < coupon.minOrderValue) {
      return NextResponse.json<CouponValidateResult>(
        {
          valid: false,
          error: `Minimum order value of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required`,
        },
        { status: 400 }
      );
    }

    // Scope check — if coupon is for specific products, ensure at least one applicable product is in cart
    if (coupon.scope === 'SPECIFIC_PRODUCTS' && coupon.applicableProductIds.length > 0) {
      const cartIds: string[] = Array.isArray(cartItemIds) ? cartItemIds : [];
      const hasApplicable = cartIds.some((id) => coupon.applicableProductIds.includes(id));
      if (!hasApplicable) {
        return NextResponse.json<CouponValidateResult>(
          { valid: false, error: 'This coupon is not applicable to items in your cart' },
          { status: 400 }
        );
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discountAmount = Math.round((orderTotal * coupon.value) / 100);
      if (coupon.maxDiscount && coupon.maxDiscount > 0) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else {
      // FIXED or VOUCHER
      discountAmount = Math.min(coupon.value, orderTotal);
    }

    return NextResponse.json<CouponValidateResult>({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discountAmount,
      description: coupon.description,
    });
  } catch (error: any) {
    console.error('POST /api/coupons/validate error:', error);
    return NextResponse.json<CouponValidateResult>(
      { valid: false, error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
