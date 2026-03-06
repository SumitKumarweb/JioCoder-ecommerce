# Products Vector Search Index Configuration

This vector search index is configured to work directly with the `JioCoder.products` collection.

## Index Configuration

The vector search index configuration is located at: `config/vector-search-index-template.json`

### Configuration Details

```json
{
  "fields": [
    {
      "numDimensions": 1536,
      "path": "embedding",
      "similarity": "cosine",
      "type": "vector"
    },
    {
      "type": "filter",
      "path": "inStock"
    },
    {
      "type": "filter",
      "path": "category"
    }
  ]
}
```

### Field Descriptions

- **Vector Field**: `embedding` - Stores the 1536-dimensional vector embedding
- **Filter Fields**: 
  - `inStock` - Filter by stock availability
  - `category` - Filter by product category

## Setup Instructions

### 1. Create Vector Search Index in MongoDB Atlas

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to your cluster → **Search** tab
3. Click **Create Search Index**
4. Select **JSON Editor**
5. Choose:
   - Database: `JioCoder`
   - Collection: `products`
6. Copy the configuration from `config/vector-search-index-template.json`
7. Name the index: `products_vector_index` (or your preferred name)
8. Click **Create Search Index**

**Note**: The index will take some time to build, especially if you have many products.

### 2. Generate Embeddings for Products

You need to add embeddings to your products. You can:

**Option A: Use the sync API** (if using SearchIndex model):
```bash
POST /api/search/sync?type=product
```

**Option B: Update products directly** with embeddings:

```typescript
import Product from '@/models/Product';
import { generateEmbedding, generateSearchableText } from '@/utils/embeddings';

// For a single product
const product = await Product.findById(productId);
const searchableText = `${product.name} ${product.description || ''} ${product.category || ''}`;
const embedding = await generateEmbedding(searchableText);

await Product.findByIdAndUpdate(productId, { embedding });
```

**Option C: Batch update all products**:

```typescript
import Product from '@/models/Product';
import { generateEmbedding } from '@/utils/embeddings';

const products = await Product.find({ embedding: { $exists: false } });

for (const product of products) {
  const searchableText = `${product.name} ${product.description || ''} ${product.category || ''}`;
  const embedding = await generateEmbedding(searchableText);
  await Product.findByIdAndUpdate(product._id, { embedding });
}
```

### 3. Search Products Using Vector Search

```typescript
import Product from '@/models/Product';
import { generateEmbedding } from '@/utils/embeddings';

const query = "mechanical keyboard";
const queryEmbedding = await generateEmbedding(query);

const results = await Product.aggregate([
  {
    $vectorSearch: {
      index: 'products_vector_index', // Match your index name
      path: 'embedding',
      queryVector: queryEmbedding,
      numCandidates: 100,
      limit: 20,
    },
  },
  {
    $match: {
      inStock: true, // Optional: filter by stock
    },
  },
  {
    $project: {
      name: 1,
      slug: 1,
      price: 1,
      currency: 1,
      image: 1,
      category: 1,
      inStock: 1,
      score: { $meta: 'vectorSearchScore' },
    },
  },
]);
```

## Product Model Updates

The Product model has been updated to include an `embedding` field:

```typescript
embedding?: number[]; // Vector embedding for search
```

The field is set to `select: false` by default for performance, so it won't be included in regular queries unless explicitly requested.

## API Integration

You can integrate this with the search API by updating `/api/search/route.ts` to search products directly:

```typescript
// Search products directly
const products = await Product.aggregate([
  {
    $vectorSearch: {
      index: 'products_vector_index',
      path: 'embedding',
      queryVector: queryEmbedding,
      numCandidates: limit * 10,
      limit: limit,
    },
  },
  // ... filters and projections
]);
```

## Dimensions

- **Default**: 1536 dimensions (OpenAI text-embedding-3-small)
- **Alternative**: 768 dimensions (OpenAI text-embedding-ada-002)

If you change the embedding model, update:
1. `numDimensions` in the index configuration
2. `dimensions` parameter in `generateEmbedding()` calls

## Similarity Functions

- **cosine** (default) - Best for semantic similarity
- **euclidean** - Distance-based similarity
- **dotProduct** - Dot product similarity

Cosine similarity is recommended for text embeddings.

## Troubleshooting

### Index Not Found
- Verify the index name matches in your aggregation pipeline
- Check that the index is fully built in MongoDB Atlas
- Ensure you're using the correct database and collection names

### No Results
- Verify products have embeddings (`embedding` field exists)
- Check that embeddings are the correct dimension (1536)
- Lower the `minScore` threshold if results are too strict

### Performance Issues
- Use appropriate `numCandidates` (typically 10x the limit)
- Add filters to reduce the search space
- Consider pagination for large result sets

