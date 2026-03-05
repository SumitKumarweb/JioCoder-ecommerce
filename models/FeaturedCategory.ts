import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeaturedCategory extends Document {
  collectionId: string; // Reference to Collection _id
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFeaturedCategoryConfig extends Document {
  viewAllUrl: string;
  updatedAt?: Date;
}

const FeaturedCategorySchema: Schema<IFeaturedCategory> = new Schema(
  {
    collectionId: {
      type: String,
      required: true,
      ref: 'Collection',
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

const FeaturedCategoryConfigSchema: Schema<IFeaturedCategoryConfig> = new Schema(
  {
    viewAllUrl: {
      type: String,
      default: '/products',
    },
  },
  {
    timestamps: true,
  }
);

// Clear cached models to prevent schema issues during hot-reloads
if (mongoose.models.FeaturedCategoryConfig) {
  delete (mongoose.models as any).FeaturedCategoryConfig;
}
if (mongoose.models.FeaturedCategory) {
  delete (mongoose.models as any).FeaturedCategory;
}

export const FeaturedCategoryConfig: Model<IFeaturedCategoryConfig> =
  mongoose.model<IFeaturedCategoryConfig>("FeaturedCategoryConfig", FeaturedCategoryConfigSchema);

const FeaturedCategory: Model<IFeaturedCategory> =
  mongoose.model<IFeaturedCategory>("FeaturedCategory", FeaturedCategorySchema);

export default FeaturedCategory;
