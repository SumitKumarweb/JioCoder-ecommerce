# Vector Search Implementation Guide

Vector search has been successfully integrated into the website. This document explains what was implemented and how to use it.

## 🎯 What Was Implemented

### 1. Products Vector Search API
**File:** `app/api/products/search/route.ts`

- Searches products directly from the `products` collection using MongoDB Atlas Vector Search
- Falls back to text search if vector search is unavailable
- Supports filtering by stock status and category
- Returns results with similarity scores

**Endpoint:** `GET /api/products/search?q=query&limit=50`

### 2. Updated Products Page
**File:** `app/products/page.tsx`

- Automatically uses vector search when a search query is present
- Falls back to loading all products when no query
- Maintains existing filtering and sorting functionality
- Caches search results for performance

### 3. Search Autocomplete Component
**File:** `components/SearchAutocomplete.tsx`

- Real-time search suggestions as user types
- Shows top 5 matching products
- Displays product image, name, price, and category
- Click to navigate to product page
- "View all results" link to products page

### 4. Enhanced Navbar Search
**File:** `components/Navbar.tsx`

- Integrated search autocomplete
- Controlled input with state management
- Shows autocomplete dropdown when typing
- Maintains form submission to products page

### 5. Embedding Generation API
**File:** `app/api/products/generate-embeddings/route.ts`

- Generates embeddings for products
- Batch processing support
- Status checking endpoint
- Force regeneration option

## 🚀 Setup Instructions

### Step 1: Create Vector Search Index

1. Go to MongoDB Atlas → Your Cluster → **Search** tab
2. Click **Create Search Index** → **JSON Editor**
3. Select:
   - Database: `JioCoder`
   - Collection: `products`
4. Use configuration from `config/vector-search-index-template.json`
5. Name the index: `products_vector_index`
6. Click **Create Search Index**

### Step 2: Configure Embedding Service

Edit `utils/embeddings.ts` and implement the `generateEmbedding` function with your API:

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

Add to `.env.local`:
```
OPENAI_API_KEY=your_api_key_here
```

### Step 3: Generate Embeddings for Products

**Option A: Generate for all products**
```bash
POST /api/products/generate-embeddings?limit=100
```

**Option B: Generate for specific product**
```bash
POST /api/products/generate-embeddings?productId=PRODUCT_ID
```

**Option C: Force regenerate all**
```bash
POST /api/products/generate-embeddings?force=true&limit=500
```

**Check status:**
```bash
GET /api/products/generate-embeddings
```

### Step 4: Test Search

1. Navigate to the website
2. Type in the search bar (navbar)
3. See autocomplete suggestions appear
4. Click a suggestion or press Enter to see full results
5. Results page shows vector search results

## 📖 API Reference

### Search Products

**GET** `/api/products/search`

**Query Parameters:**
- `q` (required) - Search query
- `limit` (optional) - Max results (default: 50, max: 100)
- `minScore` (optional) - Min similarity score (default: 0.3)
- `inStock` (optional) - Filter by stock (`true`/`false`)
- `category` (optional) - Filter by category

**Response:**
```json
{
  "query": "mechanical keyboard",
  "results": [
    {
      "id": "product-slug",
      "_id": "product-id",
      "name": "Product Name",
      "slug": "product-slug",
      "price": 9999,
      "currency": "INR",
      "image": "image-url",
      "category": "Keyboards",
      "description": "Product description",
      "inStock": true,
      "score": 0.92
    }
  ],
  "count": 10,
  "limit": 50,
  "minScore": 0.3,
  "method": "vector"
}
```

### Generate Embeddings

**POST** `/api/products/generate-embeddings`

**Query Parameters:**
- `limit` (optional) - Max products to process (default: 100)
- `force` (optional) - Force regenerate (`true`/`false`)
- `productId` (optional) - Specific product ID

**Response:**
```json
{
  "message": "Embedding generation completed",
  "processed": 50,
  "errors": 0,
  "total": 50,
  "results": [...]
}
```

**GET** `/api/products/generate-embeddings`

**Response:**
```json
{
  "total": 100,
  "withEmbeddings": 75,
  "withoutEmbeddings": 25,
  "percentage": "75.00"
}
```

## 🎨 User Experience

### Search Flow

1. **User types in search bar** → Autocomplete appears after 2+ characters
2. **Autocomplete shows** → Top 5 matching products with images
3. **User clicks suggestion** → Navigates to product page
4. **User presses Enter** → Navigates to products page with full results
5. **Products page** → Shows vector search results with filters and sorting

### Features

- ✅ Real-time autocomplete suggestions
- ✅ Vector similarity search (semantic understanding)
- ✅ Fallback to text search if vector search unavailable
- ✅ Product images in autocomplete
- ✅ Price and category display
- ✅ Cached results for performance
- ✅ Responsive design

## 🔧 Integration Points

### Auto-sync on Product Create/Update

To automatically generate embeddings when products are created or updated, add to your product API routes:

```typescript
import { syncDocumentToSearchIndex } from '@/utils/searchSync';

// After creating/updating product
await syncDocumentToSearchIndex('product', productData);
```

Or update the product directly:

```typescript
import Product from '@/models/Product';
import { generateEmbedding, generateSearchableText } from '@/utils/embeddings';

const searchableText = generateSearchableText('product', product);
const embedding = await generateEmbedding(searchableText);
await Product.findByIdAndUpdate(productId, { embedding });
```

## 🐛 Troubleshooting

### No Search Results

1. **Check embeddings exist:**
   ```bash
   GET /api/products/generate-embeddings
   ```

2. **Verify index is built:**
   - Check MongoDB Atlas → Search indexes
   - Ensure `products_vector_index` is fully built

3. **Check embedding service:**
   - Verify API key is set
   - Check API quota/credits
   - Review error logs

### Autocomplete Not Showing

1. Check browser console for errors
2. Verify search API is accessible
3. Ensure query is at least 2 characters
4. Check network tab for API calls

### Fallback to Text Search

If you see `"method": "text"` in search results:
- Vector search index may not be configured
- Embeddings may not exist for products
- Check error logs for details

## 📊 Performance

- **Autocomplete:** Debounced 300ms, cached results
- **Search Results:** Cached for 2 minutes
- **Embeddings:** Generated once per product
- **Vector Search:** Fast similarity matching with MongoDB Atlas

## 🔄 Next Steps

1. Generate embeddings for all existing products
2. Set up auto-sync for new/updated products
3. Monitor search performance and adjust `minScore` if needed
4. Consider adding search analytics
5. Add search result highlighting

## 📝 Notes

- Vector search requires MongoDB Atlas M10+ cluster
- Embeddings are stored in the `embedding` field (excluded from default queries)
- Search results maintain existing filtering and sorting
- Autocomplete shows top 5 results, full search shows up to 100

