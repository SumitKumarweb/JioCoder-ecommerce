import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { generateEmbedding, generateSearchableText } from '@/utils/embeddings';

/**
 * Generate Embeddings for Products API
 * 
 * This endpoint generates vector embeddings for products and updates them in the database.
 * Useful for initial setup or re-indexing products.
 * 
 * Query Parameters:
 * - limit: Maximum number of products to process (default: 100, max: 500)
 * - force: Force regenerate embeddings even if they exist (default: false)
 * - productId: Generate embedding for a specific product ID
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(500, Math.max(1, parseInt(searchParams.get('limit') || '100', 10)));
    const force = searchParams.get('force') === 'true';
    const productId = searchParams.get('productId');

    let products: any[];
    let query: any = {};

    if (productId) {
      // Process specific product
      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json(
          { message: 'Product not found', processed: 0, errors: 0 },
          { status: 404 }
        );
      }
      products = [product];
    } else {
      // Process products without embeddings or force update
      if (force) {
        query = {};
      } else {
        query = { embedding: { $exists: false } };
      }
      products = await Product.find(query).limit(limit).lean();
    }

    let processed = 0;
    let errors = 0;
    const results: Array<{ id: string; name: string; success: boolean; error?: string }> = [];

    for (const product of products) {
      try {
        // Generate searchable text
        const searchableText = generateSearchableText('product', product);

        if (!searchableText.trim()) {
          results.push({
            id: product._id.toString(),
            name: product.name || 'Unknown',
            success: false,
            error: 'No searchable content',
          });
          errors++;
          continue;
        }

        // Generate embedding
        const embedding = await generateEmbedding(searchableText);

        // Update product with embedding
        await Product.findByIdAndUpdate(product._id, {
          $set: { embedding },
        });

        results.push({
          id: product._id.toString(),
          name: product.name || 'Unknown',
          success: true,
        });
        processed++;
      } catch (error: any) {
        console.error(`Error processing product ${product._id}:`, error);
        results.push({
          id: product._id.toString(),
          name: product.name || 'Unknown',
          success: false,
          error: error.message || 'Unknown error',
        });
        errors++;
      }
    }

    return NextResponse.json({
      message: 'Embedding generation completed',
      processed,
      errors,
      total: products.length,
      results: results.slice(0, 20), // Return first 20 results for preview
    });
  } catch (error: any) {
    console.error('Generate embeddings error:', error);
    return NextResponse.json(
      {
        message: 'Failed to generate embeddings',
        error: error.message || 'Unknown error',
        processed: 0,
        errors: 0,
      },
      { status: 500 }
    );
  }
}

/**
 * Get embedding generation status
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const totalProducts = await Product.countDocuments();
    const productsWithEmbeddings = await Product.countDocuments({ embedding: { $exists: true } });
    const productsWithoutEmbeddings = totalProducts - productsWithEmbeddings;

    return NextResponse.json({
      total: totalProducts,
      withEmbeddings: productsWithEmbeddings,
      withoutEmbeddings: productsWithoutEmbeddings,
      percentage: totalProducts > 0 ? ((productsWithEmbeddings / totalProducts) * 100).toFixed(2) : '0',
    });
  } catch (error: any) {
    console.error('Get embedding status error:', error);
    return NextResponse.json(
      {
        message: 'Failed to get embedding status',
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

