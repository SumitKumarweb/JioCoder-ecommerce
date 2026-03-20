import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import Collection from '@/models/Collection';
import CareerJob from '@/models/CareerJob';

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
type SearchType = 'blog' | 'collection' | 'career';

function toSlug(input: string) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createSearchOr(fields: string[], query: string) {
  const q = query.trim();
  const phrase = escapeRegex(q);
  const words = q.split(/\s+/).map((w) => escapeRegex(w)).filter(Boolean);

  const conditions: Record<string, any>[] = [];
  fields.forEach((field) => {
    conditions.push({ [field]: { $regex: phrase, $options: 'i' } });
  });
  if (words.length > 1) {
    words.forEach((w) => {
      fields.forEach((field) => {
        conditions.push({ [field]: { $regex: w, $options: 'i' } });
      });
    });
  }

  return conditions;
}

function computeSimpleScore(text: string, query: string) {
  const lowerText = (text || '').toLowerCase();
  const q = query.trim().toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  let score = 0;
  if (lowerText.includes(q)) score += 4;
  for (const w of words) {
    if (lowerText.includes(w)) score += 1;
  }
  return score;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').trim();
    const type = searchParams.get('type') as SearchType | null;
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

    if (!query) {
      return NextResponse.json({ message: 'Search query is required', results: [] }, { status: 400 });
    }

    const includeBlogs = !type || type === 'blog';
    const includeCollections = !type || type === 'collection';
    const includeCareers = !type || type === 'career';

    const blogPromise = includeBlogs
      ? Blog.find({
          published: true,
          $or: createSearchOr(['title', 'description', 'summary', 'category', 'tags'], query),
        })
          .select('_id title slug description summary category featuredImage publishedAt')
          .limit(limit)
          .lean()
      : Promise.resolve([]);

    const collectionPromise = includeCollections
      ? Collection.find({
          $or: createSearchOr(['name', 'description', 'slug'], query),
        })
          .select('_id name slug description heroImage isFeatured')
          .limit(limit)
          .lean()
      : Promise.resolve([]);

    const now = new Date();
    const careerPromise = includeCareers
      ? CareerJob.find({
          published: true,
          $or: [{ expirationDateTime: { $exists: false } }, { expirationDateTime: { $gt: now } }],
          $and: [{ $or: createSearchOr(['title', 'domain', 'companyName', 'description', 'location'], query) }],
        })
          .select('_id title slug domain companyName description location minCTC maxCTC')
          .limit(limit)
          .lean()
      : Promise.resolve([]);

    const [blogs, collections, careers] = await Promise.all([blogPromise, collectionPromise, careerPromise]);

    const results: any[] = [];

    (blogs as any[]).forEach((b) => {
      const text = `${b.title || ''} ${b.description || ''} ${b.summary || ''} ${b.category || ''}`;
      results.push({
        id: b._id.toString(),
        type: 'blog',
        title: b.title,
        description: b.description || b.summary || '',
        slug: b.slug,
        featuredImage: b.featuredImage,
        category: b.category,
        publishedAt: b.publishedAt,
        score: computeSimpleScore(text, query),
      });
    });

    (collections as any[]).forEach((c) => {
      const text = `${c.name || ''} ${c.description || ''} ${c.slug || ''}`;
      results.push({
        id: c._id.toString(),
        type: 'collection',
        title: c.name,
        description: c.description || '',
        slug: c.slug,
        heroImage: c.heroImage,
        isFeatured: c.isFeatured,
        score: computeSimpleScore(text, query),
      });
    });

    (careers as any[]).forEach((j) => {
      const text = `${j.title || ''} ${j.domain || ''} ${j.companyName || ''} ${j.description || ''} ${j.location || ''}`;
      const safeSlug = String(j.slug || '').trim() || toSlug(j.title || '');
      results.push({
        id: j._id.toString(),
        type: 'career',
        title: j.title,
        description: j.description || '',
        slug: safeSlug,
        domain: j.domain,
        companyName: j.companyName,
        location: j.location,
        minCTC: j.minCTC,
        maxCTC: j.maxCTC,
        score: computeSimpleScore(text, query),
      });
    });

    const sorted = results
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, limit);

    return NextResponse.json({
      query,
      results: sorted,
      count: sorted.length,
      limit,
      method: 'text',
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

/**
 * Alternative search method using $search aggregation (MongoDB Atlas Search)
 * This is a fallback if vector search is not available
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, type, limit = 20 } = body;

    if (!query?.trim()) {
      return NextResponse.json(
        { message: 'Search query is required', results: [] },
        { status: 400 }
      );
    }
    const searchParams = new URLSearchParams({
      q: query,
      ...(type && { type }),
      limit: limit.toString(),
    });
    const url = new URL(`/api/search?${searchParams}`, req.url);
    return GET(new NextRequest(url));
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

