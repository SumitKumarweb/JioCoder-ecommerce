import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPageMetadata extends Document {
  path: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
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
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    metaKeywords: {
      type: String,
      trim: true,
    },
    ogTitle: {
      type: String,
      trim: true,
    },
    ogDescription: {
      type: String,
      trim: true,
    },
    ogImage: {
      type: String,
      trim: true,
    },
    canonicalUrl: {
      type: String,
      trim: true,
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


