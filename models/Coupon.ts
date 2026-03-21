import mongoose, { Schema, Document, Model } from 'mongoose';

export type CouponType = 'PERCENTAGE' | 'FIXED' | 'VOUCHER';
export type CouponScope = 'ALL' | 'SPECIFIC_PRODUCTS';

export interface ICoupon extends Document {
  code: string;
  description: string;
  type: CouponType;
  value: number;
  scope: CouponScope;
  applicableProductIds: string[];
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usageCount: number;
  perUserLimit: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CouponSchema: Schema<ICoupon> = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['PERCENTAGE', 'FIXED', 'VOUCHER'],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    scope: {
      type: String,
      enum: ['ALL', 'SPECIFIC_PRODUCTS'],
      default: 'ALL',
    },
    applicableProductIds: {
      type: [String],
      default: [],
    },
    minOrderValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxDiscount: {
      type: Number,
      min: 0,
    },
    usageLimit: {
      type: Number,
      default: 0,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    perUserLimit: {
      type: Number,
      default: 0,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);

export default Coupon;
