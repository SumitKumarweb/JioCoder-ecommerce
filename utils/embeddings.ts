/**
 * Embedding Utility Service
 * 
 * This utility generates vector embeddings for text content.
 * You need to integrate with an embedding service like:
 * - OpenAI (text-embedding-ada-002 or text-embedding-3-small)
 * - Cohere (embed-english-v3.0)
 * - Hugging Face Inference API
 * - MongoDB Atlas Vectorize (if available)
 * 
 * Example implementation using OpenAI:
 */

export interface EmbeddingOptions {
  model?: string;
  dimensions?: number;
}

/**
 * Generate embeddings for text content
 * 
 * @param text - The text to generate embeddings for
 * @param options - Optional configuration
 * @returns Promise<number[]> - Array of embedding values
 */
export async function generateEmbedding(
  text: string,
  options: EmbeddingOptions = {}
): Promise<number[]> {
  const { model = 'text-embedding-3-small', dimensions = 1536 } = options;

  // TODO: Replace with your actual embedding service
  // Example with OpenAI:
  /*
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
  */

  // Example with Cohere:
  /*
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
  */

  // Placeholder: Returns zero vector (replace with actual implementation)
  console.warn('⚠️ Embedding service not configured. Returning zero vector.');
  return new Array(dimensions).fill(0);
}

/**
 * Generate searchable text from a document
 * Combines relevant fields into a single searchable string
 */
export function generateSearchableText(
  type: 'product' | 'blog' | 'collection',
  data: Record<string, any>
): string {
  switch (type) {
    case 'product':
      return [
        data.name || '',
        data.description || '',
        data.category || '',
        data.brand || '',
      ]
        .filter(Boolean)
        .join(' ');

    case 'blog':
      return [
        data.title || '',
        data.description || '',
        data.summary || '',
        data.content || '',
        data.category || '',
        data.subCategory || '',
        (data.tags || []).join(' '),
      ]
        .filter(Boolean)
        .join(' ');

    case 'collection':
      return [
        data.name || '',
        data.description || '',
      ]
        .filter(Boolean)
        .join(' ');

    default:
      return '';
  }
}

