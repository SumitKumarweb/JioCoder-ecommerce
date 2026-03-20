import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPincode extends Document {
  code: string; // 6-digit Indian PIN code (stored as string to preserve leading zeros)
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const PincodeSchema: Schema<IPincode> = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

PincodeSchema.index({ enabled: 1, updatedAt: -1 });

const Pincode: Model<IPincode> =
  mongoose.models.Pincode || mongoose.model<IPincode>("Pincode", PincodeSchema);

export default Pincode;

