import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import BlogListingClient from './BlogListingClient';
import { WebPageSchema } from '@/components/schemas';

export default async function BlogPage() {
  await connectDB();

  const query = { published: true };
  const [blogs, totalCount] = await Promise.all([
    Blog.find(query)
    .sort({ publishedAt: -1, updatedAt: -1, _id: -1 })
    .select('slug title description featuredImage category readTime date isFeatured _id published')
    .limit(12)
    .lean(),
    Blog.countDocuments(query),
  ]);

  const mapped = (blogs as any[]).map((b) => ({
    id: b._id.toString(),
    slug: b.slug,
    title: b.title || '',
    description: b.description || b.title || '',
    featuredImage: b.featuredImage || '',
    category: b.category || '',
    readTime: b.readTime || '',
    date: b.date || '',
    isFeatured: Boolean(b.isFeatured),
  }));

  return (
    <>
      <h1 className="sr-only">JioCoder blog articles and guides</h1>
      <WebPageSchema
        path="/blog"
        name="Blog - JioCoder"
        description="Tech guides, product reviews, setup tours, and industry news from JioCoder."
      />
      <BlogListingClient initialBlogs={mapped} totalCount={totalCount} />
    </>
  );
}
