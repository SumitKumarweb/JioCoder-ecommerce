import mongoose, { Schema, Document, Model } from "mongoose";

export type SectionType = "TRENDING" | "SPOTLIGHT" | "BEST_SELLER";

export interface ISectionProduct extends Document {
  product: mongoose.Types.ObjectId;
  sectionType: SectionType;
  order: number;
  badge?: string;
  // Spotlight-specific fields
  description?: string;
  features?: Array<{
    icon: string;
    text: string;
  }>;
  hotspots?: Array<{
    position: {
      top?: string;
      bottom?: string;
      left?: string;
      right?: string;
    };
    title: string;
    description: string;
    color?: string;
  }>;
  buttonText?: string;
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
    badge: {
      type: String,
      trim: true,
    },
    // Spotlight-specific fields
    description: {
      type: String,
      trim: true,
    },
    features: [
      {
        icon: {
          type: String,
          trim: true,
        },
        text: {
          type: String,
          trim: true,
        },
      },
    ],
    hotspots: [
      {
        position: {
          top: {
            type: String,
            required: false,
          },
          bottom: {
            type: String,
            required: false,
          },
          left: {
            type: String,
            required: false,
          },
          right: {
            type: String,
            required: false,
          },
        },
        title: {
          type: String,
          trim: true,
          required: false,
        },
        description: {
          type: String,
          trim: true,
          required: false,
        },
        color: {
          type: String,
          trim: true,
          default: '#22C55E', // accent-green default
        },
      },
    ],
    buttonText: {
      type: String,
      trim: true,
      default: 'Pre-order Now',
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


