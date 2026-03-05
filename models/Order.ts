import mongoose, { Schema, Document, Model } from "mongoose";

type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  status: OrderStatus;
  total: number;
  currency: string;
  paymentId?: string;
  paymentMethod?: string;
  shippingAddress?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const OrderSchema: Schema<IOrder> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: (val: IOrderItem[]) => val.length > 0,
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "SHIPPED", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    paymentId: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
    shippingAddress: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;


