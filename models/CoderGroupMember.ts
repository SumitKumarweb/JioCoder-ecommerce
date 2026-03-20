import mongoose, { Schema, Document, Model } from "mongoose";

export type GroupMemberRole = "member" | "group_admin";

export interface ICoderGroupMember extends Document {
  groupId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: GroupMemberRole;
  joinedAt: Date;
}

const CoderGroupMemberSchema = new Schema<ICoderGroupMember>(
  {
    groupId: { type: Schema.Types.ObjectId, ref: "CoderCommunityGroup", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: { type: String, enum: ["member", "group_admin"], default: "member" },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

CoderGroupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });

const CoderGroupMember: Model<ICoderGroupMember> =
  mongoose.models.CoderGroupMember ||
  mongoose.model<ICoderGroupMember>("CoderGroupMember", CoderGroupMemberSchema);

export default CoderGroupMember;
