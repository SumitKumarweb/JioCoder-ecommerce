# MongoDB Atlas Vector Search Setup Guide

This guide explains how to set up and use MongoDB Atlas Vector Search for searching products, blogs, and collections.

## Overview

The vector search implementation includes:
- **Search API** (`/api/search`) - Performs vector similarity search
- **Search Index Model** (`models/SearchIndex.ts`) - Stores embeddings and metadata
- **Sync API** (`/api/search/sync`) - Syncs documents to the search index
- **Embedding Utility** (`utils/embeddings.ts`) - Generates vector embeddings

## Prerequisites

1. MongoDB Atlas cluster (M10 or higher recommended for vector search)
2. An embedding service API key (OpenAI, Cohere, or similar)
3. Node.js environment variables configured

## Step 1: Configure Embedding Service

Edit `utils/embeddings.ts` and implement the `generateEmbedding` function with your embedding service:

### Option A: OpenAI (Recommended)

```typescript
export async function generateEmbedding(
  text: string,
  options: EmbeddingOptions = {}
): Promise<number[]> {
  const { model = 'text-embedding-3-small', dimensions = 1536 } = options;

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      input: text,
      dimensions,
    }),
  });

  if (!response.ok) {
    throw new Error(`Embedding API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}
```

Add to your `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### Option B: Cohere

```typescript
export async function generateEmbedding(
  text: string,
  options: EmbeddingOptions = {}
): Promise<number[]> {
  const response = await fetch('https://api.cohere.ai/v1/embed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'embed-english-v3.0',
      texts: [text],
      input_type: 'search_document',
      embedding_types: ['float'],
    }),
  });

  if (!response.ok) {
    throw new Error(`Embedding API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.embeddings[0];
}
```

Add to your `.env.local`:
```
COHERE_API_KEY=your_cohere_api_key_here
```

## Step 2: Create Vector Search Index in MongoDB Atlas

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to your cluster → **Search** tab
3. Click **Create Search Index**
4. Select **JSON Editor**
5. Choose your database (`JioCoder`) and collection (`searchindices`)
6. Use the following index configuration:

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
      "path": "type"
    },
    {
      "type": "filter",
      "path": "metadata.published"
    },
    {
      "type": "filter",
      "path": "metadata.inStock"
    }
  ]
}
```

7. Name the index: `vector_index`
8. Click **Create Search Index**

**Note:** The index configuration file is also available at `config/vector-search-index.json`

## Step 3: Sync Documents to Search Index

After creating the index, sync your existing documents:

```bash
# Sync all documents
curl -X POST http://localhost:3000/api/search/sync

# Sync only products
curl -X POST http://localhost:3000/api/search/sync?type=product

# Force re-index (regenerate embeddings)
curl -X POST http://localhost:3000/api/search/sync?force=true
```

Or check sync status:
```bash
curl http://localhost:3000/api/search/sync
```

## Step 4: Use the Search API

### Basic Search

```bash
GET /api/search?q=mechanical keyboard
```

### Search with Filters

```bash
# Search only products
GET /api/search?q=keyboard&type=product&limit=10

# Search only blogs
GET /api/search?q=gaming&type=blog

# Search only collections
GET /api/search?q=premium&type=collection
```

### Advanced Options

```bash
# Set minimum similarity score (0-1)
GET /api/search?q=keyboard&minScore=0.7

# Limit results
GET /api/search?q=keyboard&limit=50
```

### Response Format

```json
{
  "query": "mechanical keyboard",
  "results": [
    {
      "id": "507f1f77bcf86cd799439011",
      "type": "product",
      "title": "Mechanical Keyboard Pro",
      "description": "Premium mechanical keyboard...",
      "score": 0.92,
      "slug": "mechanical-keyboard-pro",
      "price": 9999,
      "currency": "INR",
      "inStock": true
    }
  ],
  "count": 1,
  "limit": 20,
  "minScore": 0.5
}
```

## Step 5: Auto-sync on Document Changes (Optional)

To automatically sync documents when they're created or updated, add hooks to your models:

### Example: Auto-sync Products

```typescript
// In models/Product.ts or after creating/updating products
import { syncDocumentToSearchIndex } from '@/utils/searchSync';

// After creating/updating a product
await syncDocumentToSearchIndex('product', productData);
```

## API Endpoints

### `GET /api/search`
Performs vector similarity search.

**Query Parameters:**
- `q` (required): Search query string
- `type` (optional): Filter by type (`product`, `blog`, `collection`)
- `limit` (optional): Maximum results (default: 20, max: 100)
- `minScore` (optional): Minimum similarity score (default: 0.5)

### `POST /api/search`
Alternative search method with JSON body.

**Body:**
```json
{
  "query": "search text",
  "type": "product",
  "limit": 20,
  "useVectorSearch": true
}
```

### `POST /api/search/sync`
Syncs documents to the search index.

**Query Parameters:**
- `type` (optional): Sync specific type (`product`, `blog`, `collection`)
- `force` (optional): Force re-index existing documents (`true`/`false`)

### `GET /api/search/sync`
Get sync status and statistics.

## Troubleshooting

### Index Not Found Error

If you see `INDEX_NOT_FOUND` error:
1. Verify the index name matches `vector_index` in MongoDB Atlas
2. Ensure the index is fully built (check Atlas dashboard)
3. Verify the collection name is `searchindices` (Mongoose pluralizes `SearchIndex`)

### Embedding Generation Fails

1. Check your API key is set in environment variables
2. Verify you have API credits/quota
3. Check network connectivity to embedding service
4. Review error logs in the console

### Low Search Quality

1. Increase `minScore` threshold to filter low-quality results
2. Ensure documents are properly synced (check sync status)
3. Verify embeddings are being generated correctly
4. Consider adjusting `numCandidates` in the search pipeline

### Performance Issues

1. Use appropriate `limit` values
2. Consider pagination for large result sets
3. Cache frequently searched queries
4. Monitor MongoDB Atlas performance metrics

## Vector Dimensions

The default configuration uses **1536 dimensions** (OpenAI text-embedding-3-small). If you use a different embedding model:

1. Update `numDimensions` in `config/vector-search-index.json`
2. Update `dimensions` default in `utils/embeddings.ts`
3. Recreate the vector search index in MongoDB Atlas
4. Re-sync all documents

## Similarity Functions

The index uses **cosine similarity** by default. MongoDB Atlas also supports:
- `euclidean` - Euclidean distance
- `dotProduct` - Dot product similarity

To change, update the `similarity` field in the index configuration.

## Next Steps

1. Integrate search into your frontend components
2. Add search result highlighting
3. Implement search analytics
4. Add autocomplete/suggestions using vector search
5. Consider hybrid search (combining vector + text search)

