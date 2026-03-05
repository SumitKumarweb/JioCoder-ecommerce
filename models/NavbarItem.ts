import mongoose, { Schema, Document, Model } from "mongoose";

export interface INavbarItem extends Document {
  label: string;
  href: string;
  enabled: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const NavbarItemSchema: Schema<INavbarItem> = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    href: {
      type: String,
      required: true,
      trim: true,
    },
    enabled: {
      type: Boolean,
      default: true,
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

const NavbarItem: Model<INavbarItem> =
  mongoose.models.NavbarItem ||
  mongoose.model<INavbarItem>("NavbarItem", NavbarItemSchema);

export default NavbarItem;


