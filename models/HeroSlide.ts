import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHeroSlide extends Document {
  image: string;
  tag?: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  url?: string;
  enabled: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const HeroSlideSchema: Schema<IHeroSlide> = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    buttonText: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const HeroSlide: Model<IHeroSlide> =
  mongoose.models.HeroSlide ||
  mongoose.model<IHeroSlide>("HeroSlide", HeroSlideSchema);

export default HeroSlide;


