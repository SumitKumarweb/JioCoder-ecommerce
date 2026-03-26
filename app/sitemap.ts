import { MetadataRoute } from 'next';
import connectDB from '@/lib/db';
import Collection from '@/models/Collection';
import Product from '@/models/Product';
import Blog from '@/models/Blog';
import CareerJob from '@/models/CareerJob';
import CoderCommunityGroup from '@/models/CoderCommunityGroup';
import { getAllCodeSlugs } from '@/lib/code/codeTracks';

// Revalidate sitemap every hour (3600 seconds)
// This ensures new products, collections, and blogs are included within 1 hour
// Balance between freshness and performance
export const revalidate = 3600; // 1 hour in seconds

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.jiocoder.com").replace(
    /\/$/,
    ""
  );
  const sitemapEntries: MetadataRoute.Sitemap = [];
  const seenUrls = new Set<string>();

  const addEntry = (entry: MetadataRoute.Sitemap[number]) => {
    if (seenUrls.has(entry.url)) return;
    seenUrls.add(entry.url);
    sitemapEntries.push(entry);
  };

  // Helper function to generate URL-safe slug text
  function generateSlug(name: string): string {
    return String(name || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // Stable fallback slug for items that don't have one in DB.
  // No DB writes from sitemap generation.
  function getProductSlug(product: { _id: unknown; name?: string; slug?: string }): string {
    if (product.slug) return String(product.slug);
    const base = generateSlug(product.name || "product");
    const idPart = String(product._id || "").slice(-6).toLowerCase();
    return idPart ? `${base}-${idPart}` : base;
  }

  // Static URLs first so Google still gets core pages if MongoDB is unavailable.
  // Omit /cart (blocked in robots.txt), /sale (layout sets noindex), /checkout and /studio/checkout
  // (transactional flows — not listed here; see robots.txt).
  addEntry({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  });
  addEntry({
    url: `${baseUrl}/products`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  });
  addEntry({
    url: `${baseUrl}/collections`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  });
  addEntry({
    url: `${baseUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  });
  addEntry({
    url: `${baseUrl}/careers`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  });
  addEntry({
    url: `${baseUrl}/community`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.65,
  });
  addEntry({
    url: `${baseUrl}/compare`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.55,
  });
  addEntry({
    url: `${baseUrl}/studio`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.78,
  });
  addEntry({
    url: `${baseUrl}/about`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  });
  addEntry({
    url: `${baseUrl}/support`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  });
  addEntry({
    url: `${baseUrl}/search`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  });
  addEntry({
    url: `${baseUrl}/code`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.68,
  });
  addEntry({
    url: `${baseUrl}/llms.txt`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.35,
  });
  getAllCodeSlugs().forEach((slug) => {
    addEntry({
      url: `${baseUrl}/code/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  });

  try {
    await connectDB();

    // Fetch all collections
    const collections = await Collection.find({})
      .select('slug updatedAt productIds')
      .lean();
    
    // Add collection pages
    collections.forEach((collection) => {
      addEntry({
        url: `${baseUrl}/collections/${collection.slug}`,
        lastModified: collection.updatedAt ? new Date(collection.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });

    // Fetch ALL products (including those without slugs)
    const allProducts = await Product.find({})
      .select('_id name slug updatedAt')
      .lean();

    // Add standalone product pages - generate slugs for products that don't have them
    for (const product of allProducts) {
      const productSlug = getProductSlug(product as { _id: unknown; name?: string; slug?: string });
      
      // Add to sitemap if we have a slug
      if (productSlug) {
        addEntry({
          url: `${baseUrl}/product/${productSlug}`,
          lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }

    // Add collection-product pages (products within collections)
    for (const collection of collections as Array<{ productIds?: unknown[]; slug?: string }>) {
      if (collection?.productIds && collection.productIds.length > 0 && collection.slug) {
        // Fetch all products in this collection (including those without slugs)
        const collectionProducts = await Product.find({
          _id: { $in: collection.productIds },
        })
          .select('_id name slug updatedAt')
          .lean();

        // Generate route-safe slugs and add to sitemap
        for (const product of collectionProducts) {
          const productSlug = getProductSlug(product as { _id: unknown; name?: string; slug?: string });
          
          // Add to sitemap if we have a slug
          if (productSlug) {
            addEntry({
              url: `${baseUrl}/collections/${collection.slug}/${productSlug}`,
              lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
              changeFrequency: 'weekly',
              priority: 0.7,
            });
          }
        }
      }
    }

    // Fetch all published blog posts
    try {
      const blogPosts = await Blog.find({ published: true })
        .select('slug updatedAt publishedAt')
        .sort({ publishedAt: -1, updatedAt: -1 })
        .lean();

      // Add blog post pages
      blogPosts.forEach((post) => {
        const slug = post.slug ? encodeURIComponent(String(post.slug)) : "";
        if (!slug) return;
        addEntry({
          url: `${baseUrl}/blog/${slug}`,
          lastModified: post.updatedAt 
            ? new Date(post.updatedAt) 
            : (post.publishedAt ? new Date(post.publishedAt) : new Date()),
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      });

      console.log(`[Sitemap] Added ${blogPosts.length} blog posts to sitemap`);
    } catch (blogError) {
      console.error('[Sitemap] Error fetching blog posts:', blogError);
      // Continue even if blog posts fail
    }

    // Fetch all published and active career jobs
    try {
      const now = new Date();
      const careerJobs = await CareerJob.find({
        published: true,
        $or: [{ expirationDateTime: { $exists: false } }, { expirationDateTime: { $gt: now } }],
      })
        .select('slug title updatedAt')
        .sort({ updatedAt: -1, _id: -1 })
        .lean();

      (careerJobs as any[]).forEach((job) => {
        const slug = job.slug
          ? encodeURIComponent(String(job.slug))
          : encodeURIComponent(
              String(job.title || '')
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '')
            );

        if (!slug) return;
        addEntry({
          url: `${baseUrl}/careers/${slug}`,
          lastModified: job.updatedAt ? new Date(job.updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });

      console.log(`[Sitemap] Added ${careerJobs.length} career pages to sitemap`);
    } catch (careerError) {
      console.error('[Sitemap] Error fetching career jobs:', careerError);
      // Continue even if careers fail
    }

    // Public coder community groups (join + chat pages)
    try {
      const communityGroups = await CoderCommunityGroup.find({})
        .select('slug updatedAt')
        .sort({ updatedAt: -1 })
        .lean();

      communityGroups.forEach((g) => {
        const slug = g.slug ? String(g.slug).trim() : '';
        if (!slug) return;
        addEntry({
          url: `${baseUrl}/community/groups/${encodeURIComponent(slug)}`,
          lastModified: g.updatedAt ? new Date(g.updatedAt) : new Date(),
          changeFrequency: 'daily',
          priority: 0.55,
        });
      });

      console.log(`[Sitemap] Added ${communityGroups.length} community group pages to sitemap`);
    } catch (communityError) {
      console.error('[Sitemap] Error fetching community groups:', communityError);
    }

  } catch (error) {
    console.error('[Sitemap] Error generating sitemap:', error);
    // Return at least static pages if database fails
  }

  console.log(`[Sitemap] Generated sitemap with ${sitemapEntries.length} URLs`);
  return sitemapEntries;
}

