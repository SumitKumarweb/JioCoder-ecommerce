/**
 * Search Index Sync Utility
 * 
 * Helper functions to sync individual documents to the search index
 * Use these in your API routes after creating/updating documents
 */

import SearchIndex from '@/models/SearchIndex';
import { generateEmbedding, generateSearchableText } from './embeddings';
import mongoose from 'mongoose';

export interface SyncDocumentOptions {
  force?: boolean;
}

/**
 * Sync a single document to the search index
 * 
 * @param type - Document type ('product' | 'blog' | 'collection')
 * @param document - The document to sync
 * @param options - Sync options
 */
export async function syncDocumentToSearchIndex(
  type: 'product' | 'blog' | 'collection',
  document: any,
  options: SyncDocumentOptions = {}
): Promise<void> {
  const { force = false } = options;

  try {
    // Check if already indexed
    if (!force) {
      const existing = await SearchIndex.findOne({
        type,
        documentId: document._id || document.id,
      });

      if (existing) {
        return; // Already indexed
      }
    }

    // Generate searchable text
    const searchableText = generateSearchableText(type, document);

    if (!searchableText.trim()) {
      console.warn(`Skipping ${type} ${document._id || document.id}: no searchable content`);
      return;
    }

    // Generate embedding
    const embedding = await generateEmbedding(searchableText);

    // Prepare metadata
    const metadata: Record<string, any> = {};
    if (type === 'product') {
      metadata.slug = document.slug;
      metadata.image = document.image;
      metadata.category = document.category;
      metadata.price = document.price;
      metadata.currency = document.currency;
      metadata.inStock = document.inStock;
    } else if (type === 'blog') {
      metadata.slug = document.slug;
      metadata.featuredImage = document.featuredImage;
      metadata.category = document.category;
      metadata.subCategory = document.subCategory;
      metadata.published = document.published;
      metadata.tags = document.tags;
    } else if (type === 'collection') {
      metadata.slug = document.slug;
      metadata.heroImage = document.heroImage;
      metadata.isFeatured = document.isFeatured;
    }

    // Create or update search index entry
    await SearchIndex.findOneAndUpdate(
      {
        type,
        documentId: document._id || document.id,
      },
      {
        type,
        documentId: document._id || document.id,
        title: document.name || document.title || '',
        description: document.description || document.summary || '',
        content: searchableText,
        embedding,
        metadata,
      },
      {
        upsert: true,
        new: true,
      }
    );
  } catch (error) {
    console.error(`Error syncing ${type} to search index:`, error);
    throw error;
  }
}

/**
 * Remove a document from the search index
 * 
 * @param type - Document type
 * @param documentId - The document ID to remove
 */
export async function removeDocumentFromSearchIndex(
  type: 'product' | 'blog' | 'collection',
  documentId: string | mongoose.Types.ObjectId
): Promise<void> {
  try {
    await SearchIndex.deleteOne({
      type,
      documentId: typeof documentId === 'string' ? new mongoose.Types.ObjectId(documentId) : documentId,
    });
  } catch (error) {
    console.error(`Error removing ${type} from search index:`, error);
    throw error;
  }
}

/**
 * Batch sync multiple documents
 * 
 * @param type - Document type
 * @param documents - Array of documents to sync
 * @param options - Sync options
 */
export async function batchSyncDocumentsToSearchIndex(
  type: 'product' | 'blog' | 'collection',
  documents: any[],
  options: SyncDocumentOptions = {}
): Promise<{ synced: number; errors: number }> {
  let synced = 0;
  let errors = 0;

  for (const doc of documents) {
    try {
      await syncDocumentToSearchIndex(type, doc, options);
      synced++;
    } catch (error) {
      console.error(`Error syncing ${type} ${doc._id || doc.id}:`, error);
      errors++;
    }
  }

  return { synced, errors };
}

