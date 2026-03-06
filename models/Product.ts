import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug?: string;
  price: number;
  currency: string;
  inStock: boolean;
  description?: string;
  image?: string;
  category?: string;
  embedding?: number[]; // Vector embedding for search
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      trim: true,
    },
    embedding: {
      type: [Number],
      default: undefined,
      select: false, // Don't include in default queries for performance
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation during hot reload in development
const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;