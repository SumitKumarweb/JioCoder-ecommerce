import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  productId: string;      // product slug (primary key for lookups)
  userId: string;         // user's _id from localStorage
  userName: string;
  userInitials: string;   // e.g. "AK" for "Arjun Kumar"
  rating: number;         // 1–5
  comment: string;
  helpfulCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ReviewSchema: Schema<IReview> = new Schema(
  {
    productId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userInitials: {
      type: String,
      required: true,
      maxlength: 3,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Enforce one review per user per product
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
