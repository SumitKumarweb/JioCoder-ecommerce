import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISaleModalConfig extends Document {
  enabled: boolean;
  showEveryNthVisit: number;
  leftImageUrl?: string;
  leftImageAlt?: string;
  leftBadgeText?: string;
  leftHeading?: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  description: string;
  emailLabel: string;
  emailPlaceholder: string;
  submitButtonText: string;
  dismissText: string;
  bottomIcons: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const SaleModalConfigSchema: Schema<ISaleModalConfig> = new Schema(
  {
    enabled: { type: Boolean, default: true },
    showEveryNthVisit: { type: Number, default: 6, min: 1 },

    // Optional: left visual pane (kept configurable to avoid hardcoding)
    leftImageUrl: { type: String, trim: true },
    leftImageAlt: { type: String, trim: true },
    leftBadgeText: { type: String, trim: true },
    leftHeading: { type: String, trim: true },

    // Right content pane
    titlePrefix: { type: String, required: true, trim: true },
    titleHighlight: { type: String, required: true, trim: true },
    titleSuffix: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    emailLabel: { type: String, required: true, trim: true },
    emailPlaceholder: { type: String, required: true, trim: true },
    submitButtonText: { type: String, required: true, trim: true },
    dismissText: { type: String, required: true, trim: true },
    bottomIcons: { type: [String], default: ["verified_user", "local_shipping", "payments"] },
  },
  { timestamps: true }
);

const SaleModalConfig: Model<ISaleModalConfig> =
  mongoose.models.SaleModalConfig ||
  mongoose.model<ISaleModalConfig>("SaleModalConfig", SaleModalConfigSchema);

export default SaleModalConfig;


