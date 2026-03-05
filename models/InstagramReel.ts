import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInstagramReel extends Document {
  title: string;
  instagramUrl: string;
  thumbnailUrl?: string;
  username: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  postedAt?: Date;
  status: "active" | "archived";
  createdAt?: Date;
  updatedAt?: Date;
}

const InstagramReelSchema: Schema<IInstagramReel> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    instagramUrl: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      default: "@jiocoder",
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    comments: {
      type: Number,
      default: 0,
      min: 0,
    },
    shares: {
      type: Number,
      default: 0,
      min: 0,
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const InstagramReel: Model<IInstagramReel> =
  mongoose.models.InstagramReel || mongoose.model<IInstagramReel>("InstagramReel", InstagramReelSchema);

export default InstagramReel;

