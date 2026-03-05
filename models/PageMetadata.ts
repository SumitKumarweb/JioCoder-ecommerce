import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPageMetadata extends Document {
  path: string;
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const PageMetadataSchema: Schema<IPageMetadata> = new Schema(
  {
    path: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    ogImage: {
      type: String,
    },
    noIndex: {
      type: Boolean,
      default: false,
    },
    noFollow: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const PageMetadata: Model<IPageMetadata> =
  mongoose.models.PageMetadata ||
  mongoose.model<IPageMetadata>("PageMetadata", PageMetadataSchema);

export default PageMetadata;


