import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { generateEmbedding } from '@/utils/embeddings';

/**
 * Products Vector Search API
 * 
 * Searches products directly from the products collection using vector search.
 * Falls back to text search if vector search is not available.
 * 
 * Query Parameters:
 * - q: Search query string (required)
 * - limit: Maximum number of results (default: 50, max: 100)
 * - minScore: Minimum similarity score threshold (0-1, default: 0.3)
 * - inStock: Filter by stock availability (true/false)
 * - category: Filter by category
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
    const minScore = Math.max(0, Math.min(1, parseFloat(searchParams.get('minScore') || '0.3')));
    const inStockParam = searchParams.get('inStock');
    const category = searchParams.get('category');

    if (!query.trim()) {
      return NextResponse.json(
        { message: 'Search query is required', results: [] },
        { status: 400 }
      );
    }

    // Build match filters
    const matchFilters: Record<string, any> = {};
    if (inStockParam === 'true') {
      matchFilters.inStock = true;
    } else if (inStockParam === 'false') {
      matchFilters.inStock = false;
    }
    if (category) {
      matchFilters.category = category;
    }

    // Escape special regex characters in query
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Split query into words for better matching
    const queryWords = query.trim().split(/\s+/).filter(Boolean);
    
    // Build text search query - search in name (title), description, and category
    // Support both exact phrase match and individual word matches
    const searchConditions: any[] = [
      { name: { $regex: escapedQuery, $options: 'i' } }, // Exact phrase match in name
      { description: { $regex: escapedQuery, $options: 'i' } }, // Exact phrase match in description
      { category: { $regex: escapedQuery, $options: 'i' } }, // Exact phrase match in category
    ];

    // Also search for individual words (for "gaming mouse" -> matches products with "gaming" OR "mouse")
    if (queryWords.length > 1) {
      queryWords.forEach((word) => {
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        searchConditions.push(
          { name: { $regex: escapedWord, $options: 'i' } },
          { description: { $regex: escapedWord, $options: 'i' } },
          { category: { $regex: escapedWord, $options: 'i' } }
        );
      });
    }

    const textSearchQuery: Record<string, any> = {
      $or: searchConditions,
      ...matchFilters,
    };

    // Check if vector search is available (products have embeddings and index exists)
    const productsWithEmbeddings = await Product.countDocuments({ embedding: { $exists: true } });
    const useVectorSearch = productsWithEmbeddings > 0;

    if (useVectorSearch) {
      try {
        // Try vector search first if embeddings exist
        const queryEmbedding = await generateEmbedding(query);

        const pipeline: any[] = [
          // Vector search stage
          {
            $vectorSearch: {
              index: 'products_vector_index', // Name of your vector search index
              path: 'embedding',
              queryVector: queryEmbedding,
              numCandidates: limit * 10, // MongoDB recommends 10x the limit
              limit: limit,
            },
          },
          // Match stage for additional filters
          {
            $match: matchFilters,
          },
          // Project stage to format results
          {
            $project: {
              _id: 1,
              name: 1,
              slug: 1,
              price: 1,
              currency: 1,
              image: 1,
              category: 1,
              description: 1,
              inStock: 1,
              score: { $meta: 'vectorSearchScore' },
            },
          },
          // Filter by minimum score
          {
            $match: {
              score: { $gte: minScore },
            },
          },
        ];

        const results = await Product.aggregate(pipeline);

        // If vector search returns results, use them
        if (results.length > 0) {
          const formattedResults = results.map((product: any) => ({
            id: product.slug || product._id.toString(),
            _id: product._id.toString(),
            name: product.name,
            slug: product.slug,
            price: product.price,
            currency: product.currency,
            image: product.image,
            category: product.category,
            description: product.description,
            inStock: product.inStock,
            score: product.score,
          }));

          return NextResponse.json({
            query,
            results: formattedResults,
            count: formattedResults.length,
            limit,
            minScore,
            method: 'vector',
          });
        }
        // If vector search returns no results, fall through to text search
      } catch (vectorError: any) {
        // Fallback to text search if vector search fails
        console.warn('Vector search failed, using text search:', vectorError.message);
      }
    }

    // Use text search (either as fallback or primary method)
    const results = await Product.find(textSearchQuery)
      .limit(limit)
      .select('name slug price currency image category description inStock')
      .sort({ name: 1 }) // Sort alphabetically for consistent results
      .lean();

    const formattedResults = results.map((product: any) => ({
      id: product.slug || product._id.toString(),
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      price: product.price,
      currency: product.currency,
      image: product.image,
      category: product.category,
      description: product.description,
      inStock: product.inStock,
    }));

    return NextResponse.json({
      query,
      results: formattedResults,
      count: formattedResults.length,
      limit,
      method: 'text',
      fallback: !useVectorSearch,
    });
  } catch (error: any) {
    console.error('Product search error:', error);
    return NextResponse.json(
      {
        message: 'Search failed',
        error: error.message || 'Unknown error',
        results: [],
      },
      { status: 500 }
    );
  }
}

