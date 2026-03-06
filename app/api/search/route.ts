import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SearchIndex from '@/models/SearchIndex';
import { generateEmbedding } from '@/utils/embeddings';
import mongoose from 'mongoose';

/**
 * MongoDB Atlas Vector Search API
 * 
 * This endpoint performs vector similarity search across products, blogs, and collections.
 * 
 * Query Parameters:
 * - q: Search query string (required)
 * - type: Filter by type ('product' | 'blog' | 'collection') - optional
 * - limit: Maximum number of results (default: 20, max: 100)
 * - minScore: Minimum similarity score threshold (0-1, default: 0.5)
 * 
 * Example: /api/search?q=mechanical keyboard&type=product&limit=10
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') as 'product' | 'blog' | 'collection' | null;
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const minScore = Math.max(0, Math.min(1, parseFloat(searchParams.get('minScore') || '0.5')));

    if (!query.trim()) {
      return NextResponse.json(
        { message: 'Search query is required', results: [] },
        { status: 400 }
      );
    }

    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query);

    // Build the aggregation pipeline for vector search
    const pipeline: any[] = [
      // Vector search stage
      {
        $vectorSearch: {
          index: 'vector_index', // Name of your vector search index in MongoDB Atlas
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: limit * 10, // MongoDB recommends 10x the limit
          limit: limit,
        },
      },
      // Match stage for additional filters
      {
        $match: {
          ...(type && { type }),
          ...(type === 'product' && { 'metadata.inStock': { $ne: false } }),
          ...(type === 'blog' && { 'metadata.published': true }),
        },
      },
      // Project stage to format results
      {
        $project: {
          _id: 1,
          type: 1,
          documentId: 1,
          title: 1,
          description: 1,
          metadata: 1,
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

    // Execute the aggregation pipeline
    const results = await SearchIndex.aggregate(pipeline);

    // Format results for the response
    const formattedResults = results.map((result) => ({
      id: result.documentId.toString(),
      type: result.type,
      title: result.title,
      description: result.description,
      score: result.score,
      ...result.metadata,
    }));

    return NextResponse.json({
      query,
      results: formattedResults,
      count: formattedResults.length,
      limit,
      minScore,
    });
  } catch (error: any) {
    console.error('Search error:', error);

    // Handle vector search index not found error
    if (error.message?.includes('vector_index') || error.message?.includes('index')) {
      return NextResponse.json(
        {
          message: 'Vector search index not configured. Please create the index in MongoDB Atlas.',
          error: 'INDEX_NOT_FOUND',
          results: [],
        },
        { status: 503 }
      );
    }

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

/**
 * Alternative search method using $search aggregation (MongoDB Atlas Search)
 * This is a fallback if vector search is not available
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { query, type, limit = 20, useVectorSearch = true } = body;

    if (!query?.trim()) {
      return NextResponse.json(
        { message: 'Search query is required', results: [] },
        { status: 400 }
      );
    }

    if (useVectorSearch) {
      // Use vector search (same as GET method)
      const searchParams = new URLSearchParams({
        q: query,
        ...(type && { type }),
        limit: limit.toString(),
      });
      const url = new URL(`/api/search?${searchParams}`, req.url);
      return GET(new NextRequest(url));
    }

    // Fallback to text search using MongoDB Atlas Search
    const pipeline: any[] = [
      {
        $search: {
          index: 'text_search_index', // Name of your text search index
          text: {
            query,
            path: {
              wildcard: '*', // Search all text fields
            },
          },
        },
      },
      {
        $match: {
          ...(type && { type }),
        },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 1,
          type: 1,
          documentId: 1,
          title: 1,
          description: 1,
          metadata: 1,
          score: { $meta: 'searchScore' },
        },
      },
    ];

    const results = await SearchIndex.aggregate(pipeline);

    const formattedResults = results.map((result) => ({
      id: result.documentId.toString(),
      type: result.type,
      title: result.title,
      description: result.description,
      score: result.score,
      ...result.metadata,
    }));

    return NextResponse.json({
      query,
      results: formattedResults,
      count: formattedResults.length,
      limit,
    });
  } catch (error: any) {
    console.error('Search error:', error);
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

