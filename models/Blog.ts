import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  description?: string;
  summary?: string;
  category?: string;
  subCategory?: string;
  featuredImage?: string;
  images?: string[];
  videos?: string[];
  content?: string;
  author?: {
    name?: string;
    role?: string;
    avatar?: string;
  };
  date?: string;
  readTime?: string;
  tags?: string[];
  isFeatured?: boolean;
  relatedProducts?: mongoose.Types.ObjectId[];
  published?: boolean;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const BlogSchema: Schema<IBlog> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    subCategory: {
      type: String,
      trim: true,
    },
    featuredImage: {
      type: String,
    },
    images: [{ type: String }],
    videos: [{ type: String }],
    content: {
      type: String,
    },
    author: {
      name: { type: String, trim: true },
      role: { type: String, trim: true },
      avatar: { type: String },
    },
    date: {
      type: String,
    },
    readTime: {
      type: String,
      trim: true,
    },
    tags: [{ type: String, trim: true }],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    relatedProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// In development, delete the cached Mongoose model on every HMR reload so
// schema changes (like adding relatedProducts) are picked up immediately
// without needing a full server restart.
if (process.env.NODE_ENV === "development" && mongoose.models.Blog) {
  delete (mongoose.models as any).Blog;
}

const Blog: Model<IBlog> = mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
