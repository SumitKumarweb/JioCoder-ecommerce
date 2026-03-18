import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import BlogListingClient from './BlogListingClient';

export default async function BlogPage() {
  await connectDB();

  const blogs = await Blog.find({ published: true })
    .sort({ publishedAt: -1, updatedAt: -1 })
    .select('slug title description featuredImage category readTime date isFeatured _id published')
    .lean();

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

  return <BlogListingClient blogs={mapped} />;
}
