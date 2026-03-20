import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICareerJob extends Document {
  title: string; // e.g. Frontend Engineer
  slug: string; // unique URL slug generated from title
  domain: string; // e.g. Frontend, Backend, MERN, etc.
  companyName: string;
  companyEmail?: string;
  location?: string;
  description?: string; // plain text or markdown; avoid raw HTML
  problemSolvingRequirement?: string;
  minCTC?: number;
  maxCTC?: number;
  expirationDateTime?: Date;
  published: boolean;
}

const CareerJobSchema: Schema<ICareerJob> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    domain: { type: String, required: true, trim: true, index: true },
    companyName: { type: String, required: true, trim: true },
    companyEmail: { type: String, trim: true },
    location: { type: String, trim: true },
    description: { type: String, trim: true },
    problemSolvingRequirement: { type: String, trim: true },
    minCTC: { type: Number },
    maxCTC: { type: Number },
    expirationDateTime: { type: Date },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

const CareerJob: Model<ICareerJob> =
  mongoose.models.CareerJob || mongoose.model<ICareerJob>("CareerJob", CareerJobSchema);

export default CareerJob;

