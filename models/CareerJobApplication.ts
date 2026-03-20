import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICareerJobApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone?: string;
  linkedin?: string;
  coverLetter?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  status: "submitted" | "shortlisted" | "rejected";
  domainSnapshot?: string;
}

const CareerJobApplicationSchema: Schema<ICareerJobApplication> = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "CareerJob", required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    coverLetter: { type: String, trim: true },
    resumeUrl: { type: String, trim: true },
    resumeFileName: { type: String, trim: true },
    status: { type: String, enum: ["submitted", "shortlisted", "rejected"], default: "submitted" },
    domainSnapshot: { type: String, trim: true },
  },
  { timestamps: true }
);

// One row per email+job (avoid duplicates)
CareerJobApplicationSchema.index({ jobId: 1, email: 1 }, { unique: true });
CareerJobApplicationSchema.index({ createdAt: -1 });

const CareerJobApplication: Model<ICareerJobApplication> =
  mongoose.models.CareerJobApplication ||
  mongoose.model<ICareerJobApplication>("CareerJobApplication", CareerJobApplicationSchema);

export default CareerJobApplication;

