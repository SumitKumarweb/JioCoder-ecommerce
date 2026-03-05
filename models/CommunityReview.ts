import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICommunityReview extends Document {
  authorName: string;
  avatarUrl?: string;
  rating: number;
  title?: string;
  content: string;
  product?: mongoose.Types.ObjectId;
  highlight?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CommunityReviewSchema: Schema<ICommunityReview> = new Schema(
  {
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    highlight: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const CommunityReview: Model<ICommunityReview> =
  mongoose.models.CommunityReview ||
  mongoose.model<ICommunityReview>("CommunityReview", CommunityReviewSchema);

export default CommunityReview;


