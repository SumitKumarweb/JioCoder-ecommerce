import mongoose, { Schema, Document, Model } from "mongoose";

/** Instagram-style status visible for 24 hours */
export interface ICoderUserStatus extends Document {
  userId: mongoose.Types.ObjectId;
  text: string;
  imageUrl?: string;
  createdAt: Date;
  expiresAt: Date;
}

const CoderUserStatusSchema = new Schema<ICoderUserStatus>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    text: { type: String, required: true, trim: true, maxlength: 280 },
    imageUrl: { type: String, trim: true, maxlength: 2000 },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: false }
);

CoderUserStatusSchema.index({ userId: 1, expiresAt: -1 });

const CoderUserStatus: Model<ICoderUserStatus> =
  mongoose.models.CoderUserStatus ||
  mongoose.model<ICoderUserStatus>("CoderUserStatus", CoderUserStatusSchema);

export default CoderUserStatus;
