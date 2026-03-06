import mongoose, { Schema, Document, Model } from "mongoose";

export type LeadSource = "sale-modal" | string;

export interface ISaleModalLead extends Document {
  email: string;
  source: LeadSource;
  tags: string[];
  pagePath?: string;
  referrer?: string;
  userAgent?: string;
  submissionCount: number;
  lastSubmittedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const SaleModalLeadSchema: Schema<ISaleModalLead> = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    source: { type: String, required: true, trim: true, default: "sale-modal" },
    tags: { type: [String], default: ["sale-modal"] },
    pagePath: { type: String, trim: true },
    referrer: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    submissionCount: { type: Number, default: 1 },
    lastSubmittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// One row per email+source; we increment submissionCount on repeat submits.
SaleModalLeadSchema.index({ email: 1, source: 1 }, { unique: true });
SaleModalLeadSchema.index({ createdAt: -1 });

const SaleModalLead: Model<ISaleModalLead> =
  mongoose.models.SaleModalLead || mongoose.model<ISaleModalLead>("SaleModalLead", SaleModalLeadSchema);

export default SaleModalLead;


