import mongoose, { Schema, Document, Model } from "mongoose";

export type WhoCanPost = "all" | "admins";

export interface ICoderCommunityGroup extends Document {
  name: string;
  slug: string;
  description?: string;
  /** Group picture shown in lists and header */
  avatarUrl?: string;
  creatorUserId: mongoose.Types.ObjectId;
  /** WhatsApp-like: who can send messages */
  whoCanPost: WhoCanPost;
  createdAt?: Date;
  updatedAt?: Date;
}

const CoderCommunityGroupSchema = new Schema<ICoderCommunityGroup>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, trim: true, maxlength: 2000 },
    avatarUrl: { type: String, trim: true, maxlength: 2000 },
    creatorUserId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    whoCanPost: { type: String, enum: ["all", "admins"], default: "all" },
  },
  { timestamps: true }
);

const CoderCommunityGroup: Model<ICoderCommunityGroup> =
  mongoose.models.CoderCommunityGroup ||
  mongoose.model<ICoderCommunityGroup>("CoderCommunityGroup", CoderCommunityGroupSchema);

export default CoderCommunityGroup;
