import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISearchIndex extends Document {
  type: 'product' | 'blog' | 'collection';
  documentId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  content: string; // Full searchable text
  embedding: number[]; // Vector embedding
  metadata: {
    slug?: string;
    image?: string;
    category?: string;
    price?: number;
    currency?: string;
    inStock?: boolean;
    published?: boolean;
    [key: string]: any;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const SearchIndexSchema: Schema<ISearchIndex> = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['product', 'blog', 'collection'],
      index: true,
    },
    documentId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    embedding: {
      type: [Number],
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient lookups
SearchIndexSchema.index({ type: 1, documentId: 1 }, { unique: true });

// Prevent model recompilation during hot reload in development
if (mongoose.models.SearchIndex) {
  delete (mongoose.models as any).SearchIndex;
}

const SearchIndex: Model<ISearchIndex> =
  mongoose.model<ISearchIndex>('SearchIndex', SearchIndexSchema);

export default SearchIndex;

