import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICommunityVideo extends Document {
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  uploadedBy: string;
  views: number;
  likes: number;
  status: "published" | "draft";
  createdAt?: Date;
  updatedAt?: Date;
}

const CommunityVideoSchema: Schema<ICommunityVideo> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
    },
    uploadedBy: {
      type: String,
      required: true,
      trim: true,
      default: "Admin",
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
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
  },
  {
    timestamps: true,
  }
);

const CommunityVideo: Model<ICommunityVideo> =
  mongoose.models.CommunityVideo || mongoose.model<ICommunityVideo>("CommunityVideo", CommunityVideoSchema);

export default CommunityVideo;

