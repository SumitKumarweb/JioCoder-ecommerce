import { MetadataRoute } from 'next';
import connectDB from '@/lib/db';
import Collection from '@/models/Collection';
import Product from '@/models/Product';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const sitemapEntries: MetadataRoute.Sitemap = [];

  try {
    await connectDB();

    // Static pages
    sitemapEntries.push(
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/products`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/collections`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/compare`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/sale`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      }
    );

    // Fetch all collections
    const collections = await Collection.find({}).select('slug updatedAt').lean();
    
    // Add collection pages
    collections.forEach((collection) => {
      sitemapEntries.push({
        url: `${baseUrl}/collections/${collection.slug}`,
        lastModified: collection.updatedAt ? new Date(collection.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });

    // Helper function to generate slug from product name
    function generateSlug(name: string): string {
      return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    // Fetch ALL products (including those without slugs)
    const allProducts = await Product.find({})
      .select('_id name slug updatedAt')
      .lean();

    // Add standalone product pages - generate slugs for products that don't have them
    for (const product of allProducts) {
      let productSlug = product.slug;
      
      // Auto-generate slug if product doesn't have one
      if (!productSlug && product.name) {
        const baseSlug = generateSlug(product.name);
        
        // Check for existing slugs with same base
        const existingCount = await Product.countDocuments({
          slug: new RegExp(`^${baseSlug}(-\\d+)?$`),
          _id: { $ne: product._id },
        });
        
        productSlug = existingCount > 0 ? `${baseSlug}-${existingCount + 1}` : baseSlug;
        
        // Save slug to DB for future use
        await Product.findByIdAndUpdate(product._id, { $set: { slug: productSlug } });
      }
      
      // Add to sitemap if we have a slug
      if (productSlug) {
        sitemapEntries.push({
          url: `${baseUrl}/product/${productSlug}`,
          lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }

    // Add collection-product pages (products within collections)
    for (const collection of collections) {
      const collectionDoc = await Collection.findById(collection._id)
        .select('productIds slug')
        .lean();
      
      if (collectionDoc?.productIds && collectionDoc.productIds.length > 0) {
        // Fetch all products in this collection (including those without slugs)
        const collectionProducts = await Product.find({
          _id: { $in: collectionDoc.productIds },
        })
          .select('_id name slug updatedAt')
          .lean();

        // Generate slugs and add to sitemap
        for (const product of collectionProducts) {
          let productSlug = product.slug;
          
          // Auto-generate slug if product doesn't have one
          if (!productSlug && product.name) {
            const baseSlug = generateSlug(product.name);
            
            // Check for existing slugs with same base
            const existingCount = await Product.countDocuments({
              slug: new RegExp(`^${baseSlug}(-\\d+)?$`),
              _id: { $ne: product._id },
            });
            
            productSlug = existingCount > 0 ? `${baseSlug}-${existingCount + 1}` : baseSlug;
            
            // Save slug to DB for future use
            await Product.findByIdAndUpdate(product._id, { $set: { slug: productSlug } });
          }
          
          // Add to sitemap if we have a slug
          if (productSlug) {
            sitemapEntries.push({
              url: `${baseUrl}/collections/${collectionDoc.slug}/${productSlug}`,
              lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
              changeFrequency: 'weekly',
              priority: 0.7,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least static pages if database fails
  }

  return sitemapEntries;
}

