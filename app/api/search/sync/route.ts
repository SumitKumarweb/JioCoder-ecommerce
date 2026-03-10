import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SearchIndex from '@/models/SearchIndex';
import Product from '@/models/Product';
import Blog from '@/models/Blog';
import Collection from '@/models/Collection';
import { generateEmbedding, generateSearchableText } from '@/utils/embeddings';

/**
 * Sync Search Index API
 * 
 * This endpoint syncs products, blogs, and collections to the search index.
 * It generates embeddings and stores them in the SearchIndex collection.
 * 
 * Query Parameters:
 * - type: Sync specific type ('product' | 'blog' | 'collection') - optional, syncs all if not provided
 * - force: Force re-index even if document exists (default: false)
 * 
 * Example: /api/search/sync?type=product&force=true
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') as 'product' | 'blog' | 'collection' | null;
    const force = searchParams.get('force') === 'true';

    const typesToSync: ('product' | 'blog' | 'collection')[] = type ? [type] : ['product', 'blog', 'collection'];
    const results: Record<string, { synced: number; errors: number }> = {};

    for (const syncType of typesToSync) {
      let synced = 0;
      let errors = 0;

      try {
        let documents: any[] = [];
        let model: any;

        switch (syncType) {
          case 'product':
            model = Product;
            documents = await Product.find({}).lean();
            break;
          case 'blog':
            model = Blog;
            documents = await Blog.find({}).lean();
            break;
          case 'collection':
            model = Collection;
            documents = await Collection.find({}).lean();
            break;
        }

        for (const doc of documents) {
          try {
            // Check if search index entry already exists
            const existing = await SearchIndex.findOne({
              type: syncType,
              documentId: doc._id,
            });

            if (existing && !force) {
              continue; // Skip if already indexed and not forcing
            }

            // Generate searchable text
            const searchableText = generateSearchableText(syncType, doc);

            if (!searchableText.trim()) {
              console.warn(`Skipping ${syncType} ${doc._id}: no searchable content`);
              continue;
            }

            // Generate embedding
            const embedding = await generateEmbedding(searchableText);

            // Prepare metadata
            const metadata: Record<string, any> = {};
            if (syncType === 'product') {
              metadata.slug = doc.slug;
              metadata.image = doc.image;
              metadata.category = doc.category;
              metadata.price = doc.price;
              metadata.currency = doc.currency;
              metadata.inStock = doc.inStock;
            } else if (syncType === 'blog') {
              metadata.slug = doc.slug;
              metadata.featuredImage = doc.featuredImage;
              metadata.category = doc.category;
              metadata.subCategory = doc.subCategory;
              metadata.published = doc.published;
              metadata.tags = doc.tags;
            } else if (syncType === 'collection') {
              metadata.slug = doc.slug;
              metadata.heroImage = doc.heroImage;
              metadata.isFeatured = doc.isFeatured;
            }

            // Create or update search index entry
            await SearchIndex.findOneAndUpdate(
              {
                type: syncType,
                documentId: doc._id,
              },
              {
                type: syncType,
                documentId: doc._id,
                title: doc.name || doc.title || '',
                description: doc.description || doc.summary || '',
                content: searchableText,
                embedding,
                metadata,
              },
              {
                upsert: true,
                new: true,
              }
            );

            synced++;
          } catch (error: any) {
            console.error(`Error syncing ${syncType} ${doc._id}:`, error);
            errors++;
          }
        }

        results[syncType] = { synced, errors };
      } catch (error: any) {
        console.error(`Error syncing ${syncType}:`, error);
        results[syncType] = { synced: 0, errors: 1 };
      }
    }

    const totalSynced = Object.values(results).reduce((sum, r) => sum + r.synced, 0);
    const totalErrors = Object.values(results).reduce((sum, r) => sum + r.errors, 0);

    return NextResponse.json({
      message: 'Search index sync completed',
      results,
      summary: {
        totalSynced,
        totalErrors,
      },
    });
  } catch (error: any) {
    console.error('Search sync error:', error);
    return NextResponse.json(
      {
        message: 'Search index sync failed',
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Get sync status
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const productCount = await Product.countDocuments();
    const blogCount = await Blog.countDocuments();
    const collectionCount = await Collection.countDocuments();

    const indexedProductCount = await SearchIndex.countDocuments({ type: 'product' });
    const indexedBlogCount = await SearchIndex.countDocuments({ type: 'blog' });
    const indexedCollectionCount = await SearchIndex.countDocuments({ type: 'collection' });

    return NextResponse.json({
      products: {
        total: productCount,
        indexed: indexedProductCount,
        pending: productCount - indexedProductCount,
      },
      blogs: {
        total: blogCount,
        indexed: indexedBlogCount,
        pending: blogCount - indexedBlogCount,
      },
      collections: {
        total: collectionCount,
        indexed: indexedCollectionCount,
        pending: collectionCount - indexedCollectionCount,
      },
    });
  } catch (error: any) {
    console.error('Sync status error:', error);
    return NextResponse.json(
      {
        message: 'Failed to get sync status',
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

