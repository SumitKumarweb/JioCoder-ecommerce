import mongoose, { Schema, Document, Model } from 'mongoose';

export type CustomOrderStatus = 'PENDING' | 'PROCESSING' | 'PRINTING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';

export interface ICustomOrder extends Document {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  userId?: mongoose.Types.ObjectId;

  // Design
  designImageUrl: string;       // uploaded image URL (base64 data URI or cloud URL)
  designImageName: string;

  // Customisation choices
  size: string;                 // e.g. "Small (30x25cm)", "Medium (45x40cm)", "XL (90x45cm)"
  material: string;             // e.g. "Stitched Edge", "Standard"
  overlayText?: string;
  overlayFont?: string;
  overlayColor?: string;

  // Pricing
  price: number;
  quantity: number;
  total: number;

  // Shipping
  shippingAddress?: Record<string, unknown>;

  status: CustomOrderStatus;
  adminNotes?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

const CustomOrderSchema: Schema<ICustomOrder> = new Schema(
  {
    orderNumber: { type: String, unique: true, trim: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, trim: true, lowercase: true },
    customerPhone: { type: String, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },

    designImageUrl: { type: String, required: true },
    designImageName: { type: String, default: 'custom-design' },

    size: { type: String, required: true },
    material: { type: String, default: 'Stitched Edge' },
    overlayText: { type: String, trim: true },
    overlayFont: { type: String, default: 'Inter' },
    overlayColor: { type: String, default: '#ffffff' },

    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    total: { type: Number, required: true, min: 0 },

    shippingAddress: { type: Schema.Types.Mixed },

    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'PRINTING', 'SHIPPED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
    adminNotes: { type: String, trim: true },
  },
  { timestamps: true }
);

// orderNumber is assigned in app/api/studio/orders (POST)
// Drop any cached model so Next.js HMR / stale processes never keep old schema + middleware
try {
  if (mongoose.models.CustomOrder) {
    delete mongoose.models.CustomOrder;
  }
} catch {
  /* ignore */
}

const CustomOrder: Model<ICustomOrder> = mongoose.model<ICustomOrder>(
  'CustomOrder',
  CustomOrderSchema
);

export default CustomOrder;
