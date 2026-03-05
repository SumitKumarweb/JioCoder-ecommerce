'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  subCategory?: string;
  author: { name: string; role: string; avatar: string };
  date: string;
  readTime: string;
  views?: string;
  featuredImage: string;
  tags: string[];
  likes?: string;
  comments?: number;
  images: string[];
  videos: string[];
  description?: string;
  content?: string;
  summary?: string;
  relatedProducts?: RelatedProduct[];
}

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  slug?: string;
}

interface ReadNextPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  featuredImage: string;
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [readNextPosts, setReadNextPosts] = useState<ReadNextPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        // Fetch the blog post by slug (returns with populated relatedProducts)
        const blogRes = await fetch(`/api/admin/blogs?slug=${encodeURIComponent(slug)}`);
        if (!blogRes.ok) {
          setNotFound(true);
          return;
        }
        const blog = await blogRes.json();
        setBlogPost(blog);

        // Fetch other blogs for "Read Next" (exclude current)
        const allRes = await fetch('/api/admin/blogs');
        if (allRes.ok) {
          const allBlogs = await allRes.json();
          const others = (Array.isArray(allBlogs) ? allBlogs : [])
            .filter((b: any) => b.slug !== slug)
            .slice(0, 3)
            .map((b: any) => ({
              id: b.id,
              slug: b.slug,
              title: b.title,
              category: b.category,
              description: b.description,
              featuredImage: b.featuredImage,
            }));
          setReadNextPosts(others);
        }
      } catch (e) {
        console.error('Error loading blog post:', e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2 mb-8">
            <div className="h-4 w-12 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-3 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-10 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-3 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* ── Article skeleton ── */}
            <div className="lg:col-span-8 space-y-6">
              {/* Category + Title */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
                  <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse" />
                </div>
                <div className="h-10 bg-slate-200 rounded-lg animate-pulse w-full" />
                <div className="h-10 bg-slate-200 rounded-lg animate-pulse w-4/5" />
              </div>

              {/* Author bar */}
              <div className="flex items-center justify-between py-6 border-y border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-slate-200 animate-pulse shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-28 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-40 bg-slate-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="h-5 bg-slate-200 rounded animate-pulse w-full" />
                <div className="h-5 bg-slate-200 rounded animate-pulse w-3/4" />
              </div>

              {/* Featured image */}
              <div className="w-full aspect-[16/9] bg-slate-200 rounded-xl animate-pulse" />

              {/* Content lines */}
              <div className="space-y-3 pt-2">
                {[100, 95, 88, 100, 92, 80, 96, 72, 100, 85, 90, 60].map((w, i) => (
                  <div
                    key={i}
                    className="h-4 bg-slate-200 rounded animate-pulse"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>

              {/* Code block placeholder */}
              <div className="rounded-xl overflow-hidden">
                <div className="h-9 bg-slate-300 animate-pulse" />
                <div className="bg-slate-200 animate-pulse p-5 space-y-2">
                  {[70, 85, 55, 75, 65].map((w, i) => (
                    <div key={i} className="h-3.5 bg-slate-300 rounded animate-pulse" style={{ width: `${w}%` }} />
                  ))}
                </div>
              </div>

              {/* More content lines */}
              <div className="space-y-3">
                {[100, 88, 95, 78, 100, 65].map((w, i) => (
                  <div
                    key={i}
                    className="h-4 bg-slate-200 rounded animate-pulse"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>

              {/* Tags row */}
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                {[60, 72, 50, 80].map((w, i) => (
                  <div key={i} className="h-7 bg-slate-200 rounded-md animate-pulse" style={{ width: w }} />
                ))}
              </div>
            </div>

            {/* ── Sidebar skeleton ── */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* Related products card */}
                <div className="rounded-xl border border-slate-200 p-6 space-y-5">
                  <div className="h-5 w-36 bg-slate-200 rounded animate-pulse" />
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                      <div className="size-20 rounded-lg bg-slate-200 animate-pulse shrink-0" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-4/5" />
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-2/5" />
                        <div className="h-3.5 bg-slate-200 rounded animate-pulse w-3/5 mt-3" />
                      </div>
                    </div>
                  ))}
                  <div className="h-10 bg-slate-200 rounded-lg animate-pulse w-full" />
                </div>

                {/* Newsletter card */}
                <div className="rounded-xl border border-slate-200 p-6 space-y-3">
                  <div className="h-5 w-44 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-full" />
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-5/6" />
                  <div className="h-10 bg-slate-200 rounded-lg animate-pulse w-full mt-2" />
                  <div className="h-10 bg-slate-200 rounded-lg animate-pulse w-full" />
                </div>
              </div>
            </aside>
          </div>

          {/* ── Read Next skeleton ── */}
          <div className="mt-24 pt-16 border-t border-slate-200">
            <div className="flex items-center justify-between mb-10">
              <div className="h-8 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="h-5 w-24 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-video rounded-xl bg-slate-200 animate-pulse" />
                  <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
                  <div className="h-5 bg-slate-200 rounded animate-pulse w-5/6" />
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-full" />
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-4/5" />
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (notFound || !blogPost) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <span className="material-symbols-outlined text-7xl text-slate-300 mb-4">article</span>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Blog Post Not Found</h1>
            <p className="text-slate-500 mb-8">The article you're looking for doesn't exist or may have been removed.</p>
            <Link href="/blog" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all">
              ← Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: blogPost.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Article Content (8 cols) */}
          <article className="lg:col-span-8">
            {/* Header */}
            <header className="mb-10">
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                  {blogPost.category}
                </span>
                {blogPost.subCategory && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
                    {blogPost.subCategory}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">{blogPost.title}</h1>
              <div className="flex items-center justify-between py-6 border-y border-slate-200">
                <div className="flex items-center gap-3">
                  {blogPost.author?.avatar && (
                    <img className="size-10 rounded-full object-cover" alt={blogPost.author.name} src={blogPost.author.avatar} />
                  )}
                  <div>
                    <p className="text-sm font-bold">{blogPost.author?.name}</p>
                    <p className="text-xs text-slate-500">
                      {blogPost.author?.role} • {blogPost.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-500 text-sm">
                  {blogPost.readTime && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg">schedule</span>
                      {blogPost.readTime}
                    </span>
                  )}
                  {blogPost.views && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg">visibility</span>
                      {blogPost.views} views
                    </span>
                  )}
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {blogPost.featuredImage && (
              <div className="rounded-xl overflow-hidden mb-10 aspect-[16/9] bg-slate-200">
                <img className="w-full h-full object-cover" alt={blogPost.title} src={blogPost.featuredImage} />
              </div>
            )}

            {/* Additional Images */}
            {blogPost.images && blogPost.images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-10">
                {blogPost.images.map((img, index) => (
                  <img key={index} src={img} alt={`${blogPost.title} - Image ${index + 1}`} className="w-full h-64 object-cover rounded-xl" />
                ))}
              </div>
            )}

            {/* Videos */}
            {blogPost.videos && blogPost.videos.length > 0 && (
              <div className="space-y-4 mb-10">
                {blogPost.videos.map((video, index) => (
                  <div key={index} className="aspect-video rounded-xl overflow-hidden bg-slate-200">
                    <iframe
                      src={video}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))}
              </div>
            )}

            
            {/* Description */}
            {blogPost.description && (
              <p className="text-lg md:text-xl text-slate-500 leading-relaxed mb-8">
                {blogPost.description}
              </p>
            )}


            {/* Content */}
            <div className="prose prose-slate max-w-none">
              {blogPost.summary && (
                <p className="text-xl leading-relaxed text-slate-600 italic mb-8 not-prose border-l-4 border-primary pl-5 py-1">
                  {blogPost.summary}
                </p>
              )}
              {blogPost.content ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-extrabold text-slate-900 mt-10 mb-4 leading-tight">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 leading-snug border-b border-slate-200 pb-2">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">{children}</h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-lg font-semibold text-slate-800 mt-5 mb-2">{children}</h4>
                    ),
                    p: ({ children }) => (
                      <p className="text-slate-700 leading-relaxed mb-5 text-base">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold text-slate-900">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-slate-700">{children}</em>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-outside pl-6 mb-5 space-y-1 text-slate-700">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-outside pl-6 mb-5 space-y-1 text-slate-700">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">{children}</li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary pl-6 py-1 my-6 bg-primary/5 rounded-r-lg">
                        <div className="text-slate-700 italic">{children}</div>
                      </blockquote>
                    ),
                    code: ({ inline, className, children, ...props }: any) => {
                      if (inline) {
                        return (
                          <code className="bg-slate-100 text-primary font-mono text-sm px-1.5 py-0.5 rounded">
                            {children}
                          </code>
                        );
                      }
                      return (
                        <div className="my-6 rounded-xl overflow-hidden bg-slate-900 text-slate-100">
                          <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                            <span className="text-xs text-slate-400 font-mono">
                              {className?.replace('language-', '') || 'code'}
                            </span>
                            <button
                              onClick={() => navigator.clipboard.writeText(String(children))}
                              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">content_copy</span>
                              Copy
                            </button>
                          </div>
                          <pre className="p-5 overflow-x-auto text-sm leading-relaxed">
                            <code className="font-mono">{children}</code>
                          </pre>
                        </div>
                      );
                    },
                    pre: ({ children }) => <>{children}</>,
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
                    img: ({ src, alt }) => (
                      <img
                        src={src}
                        alt={alt || ''}
                        className="w-full rounded-xl my-6 shadow-md object-cover"
                      />
                    ),
                    hr: () => <hr className="my-8 border-slate-200" />,
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-6 rounded-xl border border-slate-200">
                        <table className="w-full text-sm text-left">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-slate-100 text-slate-700 font-semibold">{children}</thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="divide-y divide-slate-200">{children}</tbody>
                    ),
                    tr: ({ children }) => <tr className="hover:bg-slate-50 transition-colors">{children}</tr>,
                    th: ({ children }) => (
                      <th className="px-4 py-3 font-semibold text-slate-800">{children}</th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-3 text-slate-700">{children}</td>
                    ),
                  }}
                >
                  {blogPost.content}
                </ReactMarkdown>
              ) : (
                <p className="text-slate-500 italic">No content added yet.</p>
              )}
            </div>

            {/* Tags & Engagement */}
            {(blogPost.tags?.length > 0 || blogPost.likes) && (
              <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {blogPost.tags?.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${tag}`}
                      className="px-3 py-1 bg-slate-100 rounded-md text-sm hover:bg-primary/20 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  {blogPost.likes && (
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 hover:border-primary transition-all group">
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                        thumb_up
                      </span>
                      <span className="font-bold">{blogPost.likes}</span>
                    </button>
                  )}
                  <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <span className="material-symbols-outlined">bookmark</span>
                  </button>
                  <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <span className="material-symbols-outlined">share</span>
                  </button>
                </div>
              </div>
            )}

            {/* Comments Section */}
            <section className="mt-16">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                Comments
                {blogPost.comments != null && (
                  <span className="text-slate-400 text-lg font-normal">({blogPost.comments})</span>
                )}
              </h3>

              {/* Comment Input */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 mb-10">
                <div className="flex gap-4">
                  <div className="size-10 shrink-0 rounded-full bg-slate-200 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400">person</span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 focus:ring-primary focus:border-primary mb-3 p-3 outline-none"
                      placeholder="Share your thoughts or ask a question..."
                      rows={3}
                    ></textarea>
                    <div className="flex justify-end">
                      <button className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </article>

          {/* Sidebar (4 cols) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Related Products */}
              {blogPost.relatedProducts && blogPost.relatedProducts.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">shopping_bag</span>
                    Related Products
                  </h4>
                  <div className="space-y-6">
                    {blogPost.relatedProducts.map((product) => (
                      <Link key={product.id} href={`/product/${product.slug || product.id}`} className="group flex gap-4">
                        <div className="size-20 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                          {product.image ? (
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
                            <p className="text-primary font-bold text-sm mt-1">₹{product.price?.toLocaleString('en-IN')}</p>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-primary flex items-center gap-1">
                            View Product
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/products"
                    className="w-full mt-6 py-3 bg-slate-100 rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors block text-center"
                  >
                    Shop All Products
                  </Link>
                </div>
              )}

              {/* Newsletter */}
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

        {/* Read Next Section */}
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
