# MongoDB Vector Search Implementation

A complete vector search implementation for searching products, blogs, and collections using MongoDB Atlas Vector Search.

## 📁 Files Created

### Core Files
- `app/api/search/route.ts` - Main search API endpoint
- `app/api/search/sync/route.ts` - Search index sync endpoint
- `models/SearchIndex.ts` - Search index model for storing embeddings
- `utils/embeddings.ts` - Embedding generation utility
- `utils/searchSync.ts` - Helper functions for syncing documents
- `config/vector-search-index.json` - Vector search index configuration

### Documentation
- `docs/VECTOR_SEARCH_SETUP.md` - Complete setup guide

## 🚀 Quick Start

### 1. Configure Embedding Service

Edit `utils/embeddings.ts` and add your embedding API (OpenAI, Cohere, etc.):

```typescript
// Example with OpenAI
const response = await fetch('https://api.openai.com/v1/embeddings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  },
  body: JSON.stringify({
    model: 'text-embedding-3-small',
    input: text,
    dimensions: 1536,
  }),
});
```

### 2. Create Vector Search Index in MongoDB Atlas

1. Go to MongoDB Atlas → Your Cluster → **Search** tab
2. Click **Create Search Index** → **JSON Editor**
3. Select database: `JioCoder`, collection: `searchindices`
4. Copy the configuration from `config/vector-search-index.json`
5. Name it: `vector_index`
6. Click **Create Search Index**

### 3. Sync Documents

```bash
# Sync all documents
POST /api/search/sync

# Sync specific type
POST /api/search/sync?type=product

# Check sync status
GET /api/search/sync
```

### 4. Search

```bash
# Basic search
GET /api/search?q=mechanical keyboard

# Filter by type
GET /api/search?q=keyboard&type=product

# Advanced options
GET /api/search?q=keyboard&type=product&limit=10&minScore=0.7
```

## 📖 API Reference

### Search API

**GET `/api/search`**

Query parameters:
- `q` (required) - Search query
- `type` (optional) - Filter: `product`, `blog`, `collection`
- `limit` (optional) - Max results (default: 20, max: 100)
- `minScore` (optional) - Min similarity score (default: 0.5)

**Response:**
```json
{
  "query": "mechanical keyboard",
  "results": [
    {
      "id": "...",
      "type": "product",
      "title": "...",
      "description": "...",
      "score": 0.92,
      "slug": "...",
      "price": 9999,
      "inStock": true
    }
  ],
  "count": 1,
  "limit": 20,
  "minScore": 0.5
}
```

### Sync API

**POST `/api/search/sync`**

Query parameters:
- `type` (optional) - Sync specific type
- `force` (optional) - Force re-index (`true`/`false`)

**GET `/api/search/sync`**

Returns sync status and statistics.

## 🔧 Integration Examples

### Auto-sync on Product Creation

```typescript
import { syncDocumentToSearchIndex } from '@/utils/searchSync';

// After creating a product
const product = await Product.create(productData);
await syncDocumentToSearchIndex('product', product);
```

### Auto-sync on Product Update

```typescript
import { syncDocumentToSearchIndex } from '@/utils/searchSync';

// After updating a product
const product = await Product.findByIdAndUpdate(id, updateData);
await syncDocumentToSearchIndex('product', product, { force: true });
```

### Remove from Search Index

```typescript
import { removeDocumentFromSearchIndex } from '@/utils/searchSync';

// After deleting a product
await removeDocumentFromSearchIndex('product', productId);
```

## 📝 Notes

- **Vector Dimensions**: Default is 1536 (OpenAI text-embedding-3-small). Update if using a different model.
- **Collection Name**: Mongoose pluralizes `SearchIndex` to `searchindices` in MongoDB.
- **Index Name**: Must match `vector_index` in MongoDB Atlas (or update the code).
- **Performance**: Vector search works best with MongoDB Atlas M10+ clusters.

## 🔍 Troubleshooting

See `docs/VECTOR_SEARCH_SETUP.md` for detailed troubleshooting guide.

Common issues:
- **Index not found**: Verify index name and collection name in Atlas
- **Embedding errors**: Check API key and service configuration
- **Low quality results**: Adjust `minScore` threshold

## 📚 Documentation

For complete setup instructions, see: `docs/VECTOR_SEARCH_SETUP.md`

