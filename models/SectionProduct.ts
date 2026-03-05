import mongoose, { Schema, Document, Model } from "mongoose";

export type SectionType = "TRENDING" | "SPOTLIGHT" | "BEST_SELLER";

export interface ISectionProduct extends Document {
  product: mongoose.Types.ObjectId;
  sectionType: SectionType;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const SectionProductSchema: Schema<ISectionProduct> = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    sectionType: {
      type: String,
      enum: ["TRENDING", "SPOTLIGHT", "BEST_SELLER"],
      required: true,
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

const SectionProduct: Model<ISectionProduct> =
  mongoose.models.SectionProduct ||
  mongoose.model<ISectionProduct>("SectionProduct", SectionProductSchema);

export default SectionProduct;


