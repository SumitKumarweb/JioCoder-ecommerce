import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeaturedCategory extends Document {
  name: string;
  image: string;
  url: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const FeaturedCategorySchema: Schema<IFeaturedCategory> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
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

const FeaturedCategory: Model<IFeaturedCategory> =
  mongoose.models.FeaturedCategory ||
  mongoose.model<IFeaturedCategory>(
    "FeaturedCategory",
    FeaturedCategorySchema
  );

export default FeaturedCategory;


