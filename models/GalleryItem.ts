import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGalleryItem extends Document {
  image: string;
  title?: string;
  description?: string;
  url?: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const GalleryItemSchema: Schema<IGalleryItem> = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const GalleryItem: Model<IGalleryItem> =
  mongoose.models.GalleryItem ||
  mongoose.model<IGalleryItem>("GalleryItem", GalleryItemSchema);

export default GalleryItem;


