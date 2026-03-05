import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICollection extends Document {
  name: string;
  slug: string;
  description?: string;
  heroImage?: string;
  isFeatured?: boolean;
  productIds?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const CollectionSchema: Schema<ICollection> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    heroImage: {
      type: String,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    productIds: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Always delete the cached model before re-creating it.
// This ensures that schema changes (e.g. adding productIds) are picked up
// after Next.js hot-reloads, which preserve mongoose.models across reloads
// but not the module code — causing stale schemas that silently strip new fields.
if (mongoose.models.Collection) {
  delete (mongoose.models as any).Collection;
}

const Collection = mongoose.model<ICollection>("Collection", CollectionSchema);

export default Collection;


