import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/schemas';

type RelatedProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  slug?: string;
};

type ReadNextPost = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  featuredImage: string;
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connectDB();

  const { slug } = await params;

  const blogPost = await Blog.findOne({
    slug,
    published: true,
  })
    .populate({
      path: 'relatedProducts',
      select: 'name price image slug _id',
      strictPopulate: false,
    })
    .lean();

  if (!blogPost) {
    notFound();
  }

  const mappedBlogPost: {
    id: string;
    slug: string;
    title: string;
    category: string;
    subCategory?: string;
    author?: { name?: string; role?: string; avatar?: string };
    date?: string;
    readTime?: string;
    views?: string;
    featuredImage?: string;
    tags?: string[];
    likes?: string;
    comments?: number;
    images?: string[];
    videos?: string[];
    description?: string;
    content?: string;
    summary?: string;
    relatedProducts?: RelatedProduct[];
  } = {
    id: blogPost._id?.toString?.() || String(blogPost._id),
    slug: blogPost.slug,
    title: blogPost.title,
    category: blogPost.category || '',
    subCategory: blogPost.subCategory,
    author: blogPost.author,
    date: blogPost.date,
    readTime: blogPost.readTime,
    views: (blogPost as any).views,
    featuredImage: blogPost.featuredImage,
    tags: blogPost.tags || [],
    likes: (blogPost as any).likes,
    comments: (blogPost as any).comments,
    images: blogPost.images || [],
    videos: blogPost.videos || [],
    description: blogPost.description,
    content: blogPost.content,
    summary: blogPost.summary,
    relatedProducts: (blogPost.relatedProducts || []).map((p: any) => ({
      id: p._id?.toString?.() || String(p._id),
      name: p.name,
      price: p.price,
      image: p.image,
      slug: p.slug,
    })),
  };

  const readNextPostsDocs = await Blog.find({
    published: true,
    slug: { $ne: slug },
  })
    .sort({ publishedAt: -1, updatedAt: -1 })
    .limit(3)
    .select('slug title category description featuredImage _id')
    .lean();

  const readNextPosts: ReadNextPost[] = (readNextPostsDocs || []).map((p: any) => ({
    id: p._id?.toString?.() || String(p._id),
    slug: p.slug,
    title: p.title,
    category: p.category || '',
    description: p.description || '',
    featuredImage: p.featuredImage || '',
  }));

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <BreadcrumbSchema
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: mappedBlogPost.title },
          ]}
        />
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: mappedBlogPost.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <article className="lg:col-span-8">
            <header className="mb-10">
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                  {mappedBlogPost.category}
                </span>
                {mappedBlogPost.subCategory && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
                    {mappedBlogPost.subCategory}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
                {mappedBlogPost.title}
              </h1>

              <div className="flex items-center justify-between py-6 border-y border-slate-200">
                <div className="flex items-center gap-3">
                  {mappedBlogPost.author?.avatar && (
                    <img
                      className="size-10 rounded-full object-cover"
                      alt={mappedBlogPost.author?.name || 'Author'}
                      src={mappedBlogPost.author?.avatar}
                    />
                  )}
                  <div>
                    <p className="text-sm font-bold">{mappedBlogPost.author?.name || ''}</p>
                    <p className="text-xs text-slate-500">
                      {mappedBlogPost.author?.role ? `${mappedBlogPost.author.role} • ` : ''}
                      {mappedBlogPost.date || ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-500 text-sm">
                  {mappedBlogPost.readTime && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg">schedule</span>
                      {mappedBlogPost.readTime}
                    </span>
                  )}
                </div>
              </div>
            </header>

            {mappedBlogPost.featuredImage && (
              <div className="rounded-xl overflow-hidden mb-10 aspect-[16/9] bg-slate-200">
                <img className="w-full h-full object-cover" alt={mappedBlogPost.title} src={mappedBlogPost.featuredImage} />
              </div>
            )}

            {mappedBlogPost.images && mappedBlogPost.images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-10">
                {mappedBlogPost.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${mappedBlogPost.title} - Image ${index + 1}`}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                ))}
              </div>
            )}

            {mappedBlogPost.videos && mappedBlogPost.videos.length > 0 && (
              <div className="space-y-4 mb-10">
                {mappedBlogPost.videos.map((video, index) => (
                  <div key={index} className="aspect-video rounded-xl overflow-hidden bg-slate-200">
                    <iframe
                      src={video}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`${mappedBlogPost.title} video ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}

            {mappedBlogPost.description && (
              <p className="text-lg md:text-xl text-slate-500 leading-relaxed mb-8">
                {mappedBlogPost.description}
              </p>
            )}

            <div className="prose prose-slate max-w-none">
              {mappedBlogPost.summary && (
                <p className="text-xl leading-relaxed text-slate-600 italic mb-8 not-prose border-l-4 border-primary pl-5 py-1">
                  {mappedBlogPost.summary}
                </p>
              )}

              {mappedBlogPost.content ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-medium underline underline-offset-2 hover:opacity-75 transition-opacity"
                      >
                        {children}
                      </a>
                    ),
                    code: ({ inline, className, children }: any) => {
                      if (inline) {
                        return (
                          <code className="bg-slate-100 text-primary font-mono text-sm px-1.5 py-0.5 rounded">
                            {children}
                          </code>
                        );
                      }
                      return (
                        <pre className="my-6 rounded-xl overflow-hidden bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
                          <code className={className || 'font-mono'}>{children}</code>
                        </pre>
                      );
                    },
                    img: ({ src, alt }) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={src} alt={alt || ''} className="w-full rounded-xl my-6 shadow-md object-cover" />
                    ),
                  }}
                >
                  {mappedBlogPost.content}
                </ReactMarkdown>
              ) : (
                <p className="text-slate-500 italic">No content added yet.</p>
              )}
            </div>

            {mappedBlogPost.tags && mappedBlogPost.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  {mappedBlogPost.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 bg-slate-100 rounded-md text-sm hover:bg-primary/20 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {mappedBlogPost.relatedProducts && mappedBlogPost.relatedProducts.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">shopping_bag</span>
                    Related Products
                  </h4>
                  <div className="space-y-6">
                    {mappedBlogPost.relatedProducts.map((product) => (
                      <Link key={product.id} href={`/product/${product.slug || product.id}`} className="group flex gap-4">
                        <div className="size-20 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                          {product.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              alt={product.name}
                              src={product.image}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="material-symbols-outlined text-slate-300">image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-between">
                          <div>
                            <h5 className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-1">
                              {product.name}
                            </h5>
                            <p className="text-primary font-bold text-sm mt-1">
                              ₹{Number(product.price).toLocaleString('en-IN')}
                            </p>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-primary flex items-center gap-1">
                            View Product
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
                <h4 className="font-bold text-lg mb-2">Build Your Dream Setup</h4>
                <p className="text-sm text-slate-600 mb-4">
                  Get the latest hardware guides and exclusive discounts delivered to your inbox.
                </p>
                <form className="space-y-3">
                  <input
                    className="w-full bg-white border-none rounded-lg text-sm p-3 focus:ring-2 focus:ring-primary/50 outline-none"
                    placeholder="email@example.com"
                    type="email"
                    aria-label="email"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </aside>
        </div>

        {readNextPosts.length > 0 && (
          <section className="mt-24 pt-16 border-t border-slate-200">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-bold italic">Read Next</h3>
              <Link href="/blog" className="text-primary font-bold flex items-center gap-1 hover:underline">
                View all posts
                <span className="material-symbols-outlined">east</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {readNextPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                  <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-slate-200">
                    {post.featuredImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={post.title}
                        src={post.featuredImage}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-slate-300">image</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-primary uppercase mb-2 block">{post.category}</span>
                  <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{post.title}</h4>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">{post.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

