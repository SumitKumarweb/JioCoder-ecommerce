import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICoderGroupMessage extends Document {
  groupId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  body: string;
  code?: string;
  imageUrl?: string;
  createdAt: Date;
}

const CoderGroupMessageSchema = new Schema<ICoderGroupMessage>(
  {
    groupId: { type: Schema.Types.ObjectId, ref: "CoderCommunityGroup", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    body: { type: String, trim: true, maxlength: 5000, default: "" },
    code: { type: String, trim: true, maxlength: 15000 },
    imageUrl: { type: String, trim: true, maxlength: 2000 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

CoderGroupMessageSchema.index({ groupId: 1, createdAt: -1 });

const CoderGroupMessage: Model<ICoderGroupMessage> =
  mongoose.models.CoderGroupMessage ||
  mongoose.model<ICoderGroupMessage>("CoderGroupMessage", CoderGroupMessageSchema);

export default CoderGroupMessage;
