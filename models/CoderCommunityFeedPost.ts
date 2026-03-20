import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICoderCommunityFeedPost extends Document {
  userId: mongoose.Types.ObjectId;
  body: string;
  /** Code snippet (optional) */
  code?: string;
  /** Shared tutorial, repo, doc, etc. */
  resourceUrl?: string;
  imageUrl?: string;
  createdAt: Date;
}

const CoderCommunityFeedPostSchema = new Schema<ICoderCommunityFeedPost>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    body: { type: String, trim: true, maxlength: 10000, default: "" },
    code: { type: String, trim: true, maxlength: 20000 },
    resourceUrl: { type: String, trim: true, maxlength: 2000 },
    imageUrl: { type: String, trim: true, maxlength: 2000 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

CoderCommunityFeedPostSchema.index({ createdAt: -1 });

const CoderCommunityFeedPost: Model<ICoderCommunityFeedPost> =
  mongoose.models.CoderCommunityFeedPost ||
  mongoose.model<ICoderCommunityFeedPost>("CoderCommunityFeedPost", CoderCommunityFeedPostSchema);

export default CoderCommunityFeedPost;
