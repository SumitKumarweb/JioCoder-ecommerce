'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';

// Default blog post fallback
const defaultBlogPost = {
  slug: 'mechanical-keyboards',
  title: 'The Ultimate Mechanical Keyboard Guide for Developers',
  category: 'Guide',
  subCategory: 'Hardware',
  author: {
    name: 'Arjun Sharma',
    role: 'Tech Lead @ JioCoder',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBgFtVzwM5FlDoWgEaRpJxVTXIu-240nc7k3L-FxCCzXi7Zlgm7WmllrealXdlvujHKj-yu7k1Raa-g83zWB-T_B-W4vxPcT4KSDpxjAWDQucNSYYkwgU1rgPGX-6bJU8Nb3Kp4KaEIfvDx3pgd9C_9XJvUnuTWTkj2Yo55MmQhG9YvEWAzflG8ZL7K0pYpKgjjy8IYmkKQSXMBvgLizrdozzUmtAV7VsVbJIiQOW1AWlUVOA9OLQwGM4vZfQoKU6nbRard9oB8PXeZ',
  },
  date: 'Oct 24, 2023',
  readTime: '8 min read',
  views: '12.4k',
  featuredImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDNloL5lEvQDdsxvTn0m2SsCc1ltKPlz5IINDmeFYZ0kyZ3CvKABWsvvV6dkKiGi8iZgMXJ6UW_lKOn83Yy14WSosj1dYjGcJn32vZkHSzMy7YbRn1kZLIH00HNR6HWmVa-Xz0Cw9iyE7Zo1HYHL8LZUJFR0IYTqjEnYaslUhzxm_OUtr4ppPaxeSAjtROtdhOuxyBlZTEGmEbnvAmR8HKV6mqQA8BNpjNs6AZIJ5SEmt0waXxvbuv3E9bY3_mE2GWduRwJG42nurMx',
  tags: ['MechanicalKeyboard', 'SetupTour', 'DeveloperTools'],
  likes: '1.2k',
  comments: 42,
  images: [],
  videos: [],
  content: '',
  summary: '', // Add summary property
};

const relatedProducts = [
  {
    id: 'product-1',
    name: 'Keychron K2 Wireless',
    price: 8999,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA6yKY91-dWf_GMT6oaqI4HYNO33UfrrjcA3hywLZIxPQoM1RQV602EXk-LnBOXPgISDWvGRo3BktKUaPDeIPdrNUWrjBRzEbmtxxtyyf-DS9jBMNEEB5RVENQpSL-uwj3zWObB7tP2BB-HnSDpMc-rcn3SpTORuHPmxzTBpN2DKLESSC91CpNfjmSHuK9tLiTBqaqhRt1Qu4p9FgubPd3n63VEOT1p0HUdxSZCAuUvRIUinyjYNW3N0kLzE7ewp9Zc8m0m1X1RF-RS',
  },
  {
    id: 'product-2',
    name: 'Logitech MX Master 3S',
    price: 10495,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuANkaY6pw2kin41X43fokvUxUZKMxWgxhRh9tFtOsGYx8j0AcKP3CX4YPtNdwBOXbZ2LTzSRcxNG0_2Xe58VgDq62tAFzq50z6_6ErvhFFJkNqyXha41S94Npz3o4xcuCwMvJkbAr1uao_Xo1Wp8uFNDXk3fzlRIR-bdpO7Fm1MR_KvNy_R0M_gqLJPjSpqETy9WL9yLsEKUBh6KbuyOIUvL3cqfQVPhArjpvqb-UsiIzuQiPTnIZutagCtzIztNvavDAxNkDSzKmpZ',
  },
  {
    id: 'product-3',
    name: 'Glorious GMMK Pro',
    price: 16999,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAvVDUgA-B0-uKO9aRjcGCRNW7HTsdw0A7z4PJ-7Ohq1f6GUDqoeexPXbqrLPw1i3M6UpckjWFmbJP-gHF4kYp6irh51j9rH2s-t4GhYzgWQdxpYnyhqHDh1cmg1jMtD2taAFnHEEmPy5yOHtprfcE_3rKMXcFrMVAwkPE1QpabzRshaK3xBRVycCPlhvz_q_JuEFziwXNiGZSZj86KWINExmkEsinUGNHDS3fqNbs0_k947tWvUDYjWDtXe5_fw50wX05oxXO7fEgw',
  },
];

const readNextPosts = [
  {
    slug: 'retro-tech',
    title: 'The Resurgence of 90s Computing Hardware',
    category: 'Retro Tech',
    description: 'Why modern developers are going back to basics with vintage builds.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDfqI_VDU0PZyBkO2MYZR4PRuXn3LJfxWQTO6CyLYaJrsZkY_w8dww25Ool8Uc9LQa9MSywNz8mUuVB0bJA2Q09YTp1mqouxGFcZ8hfehCYsNaQeDV54KgI3kej_rpIDMe0QJrl7nFRub1PK5icTXPQAldnVEicEw7oUzynhx5mcjbjSLXHJyjcKp1YTrsjNo-auOubKhb5MEOTiU80ifLRveU3QRAlpqL_R2qMRNg7Tqanl5Daf7RxAWUM3sXCvLEiPyJKRKYEUGBS',
  },
  {
    slug: 'ergonomics',
    title: 'Ergonomics 101: Improving Your Workspace',
    category: 'Lifestyle',
    description: 'Practical tips to prevent repetitive strain injuries during crunch time.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAgVU9-9QcVGc6HCS0u4xSpz_UWEFUOwMFcgc3JUoh6PYfUjfRPYnDTRP7Uew6dFkm6NaOjldfEp34v3G6JF5mWjQtsOvqnJTO3zDQSVwuxBxf8evrUnvvsjrirXDR8q05F0GKocFqlefcNjJJkfkehPFeXv4Xpub4sp4JZ0TfQD7O5Qy7zszrvzEcvFd218yy_76-HxqdTYoWwbyDEy8Xi4SXWIkhfgMC3i84nCW88KudTVYeqLjLgKrR12zRaS_zjgJjLacW2D1fN',
  },
  {
    slug: 'switches',
    title: 'The Science of Linear vs Tactile Switches',
    category: 'Components',
    description: 'A technical deep dive into spring force and actuation points.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCZeDoYkNaD2XJkrv7MFXltzDLr1FlzVbTPqdu_1qRMUIz1rJ23-clk8EROeO01JiKeTUx9KcUqIGEUcEBUtUIOkGFL5qQaWmu369Qtst_DJSxCz80yhvveFPHQkRGbcm5ROcZ-2GTEjIh4J1tkU50ObaSYX1XGs05vMMpJ9W7_Yngab_R5zDjBdGTfvosaOtZw8lABxSa1S5YwLf8bcPLhcwDhP1M3Q3c1NYaLKONsj_YtWzK7DUapEHZav_xtL-eO0EmdwBHv7p51',
  },
];

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [blogPost, setBlogPost] = useState(defaultBlogPost);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load blog from admin panel
    const saved = localStorage.getItem('adminBlogs');
    if (saved) {
      try {
        const blogs = JSON.parse(saved);
        const foundBlog = blogs.find((b: any) => b.slug === params.slug);
        if (foundBlog) {
          setBlogPost({
            slug: foundBlog.slug,
            title: foundBlog.title,
            category: foundBlog.category,
            subCategory: foundBlog.subCategory || '',
            author: foundBlog.author,
            date: foundBlog.date,
            readTime: foundBlog.readTime,
            views: foundBlog.views || '0',
            featuredImage: foundBlog.featuredImage,
            tags: foundBlog.tags || [],
            likes: foundBlog.likes || '0',
            comments: foundBlog.comments || 0,
            images: foundBlog.images || [],
            videos: foundBlog.videos || [],
            content: foundBlog.content || '',
            summary: foundBlog.summary || '',
          });
        }
      } catch (e) {
        console.error('Error loading blog:', e);
      }
    }
    setLoading(false);
  }, [params.slug]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading blog post...</p>
            </div>
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
            { label: 'Mechanical Keyboards' },
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
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
                  {blogPost.subCategory}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">{blogPost.title}</h1>
              <div className="flex items-center justify-between py-6 border-y border-slate-200">
                <div className="flex items-center gap-3">
                  <img className="size-10 rounded-full object-cover" alt={blogPost.author.name} src={blogPost.author.avatar} />
                  <div>
                    <p className="text-sm font-bold">{blogPost.author.name}</p>
                    <p className="text-xs text-slate-500">
                      {blogPost.author.role} • {blogPost.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-500 text-sm">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">schedule</span>
                    {blogPost.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">visibility</span>
                    {blogPost.views} views
                  </span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <div className="rounded-xl overflow-hidden mb-10 aspect-[16/9] bg-slate-200">
              <img className="w-full h-full object-cover" alt={blogPost.title} src={blogPost.featuredImage} />
            </div>

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

            {/* Content */}
            <div className="prose max-w-none">
              {blogPost.summary && (
                <p className="text-xl leading-relaxed text-slate-600 italic mb-8">{blogPost.summary}</p>
              )}
              {blogPost.content ? (
                <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
              ) : (
                <>
                  <p className="text-xl leading-relaxed text-slate-600 italic mb-8">
                    Choosing the right keyboard isn't just about ergonomics—it's about the tactile feedback that makes
                    every line of code feel intentional. In this guide, we dive deep into the world of switches, keycaps,
                    and layouts.
                  </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Why Mechanical?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                For developers, the keyboard is the primary tool of the trade. Unlike traditional membrane keyboards,
                mechanical keyboards offer individual switches for each key, leading to increased durability and a
                highly customizable typing experience.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="text-slate-700">
                  <strong>Tactile Feedback:</strong> Know exactly when a keypress is registered.
                </li>
                <li className="text-slate-700">
                  <strong>Durability:</strong> Rated for up to 50-100 million keystrokes.
                </li>
                <li className="text-slate-700">
                  <strong>Customizability:</strong> Hot-swappable boards allow you to change switches without soldering.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Customizing Your Layout</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Modern keyboards like the Keychron series allow for deep customization via software. For developers
                using specialized IDE shortcuts, mapping keys can save hours of repetitive motion.
              </p>

              {/* Code Block */}
              <div className="my-8 rounded-lg overflow-hidden bg-slate-900 text-slate-300 font-mono text-sm">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                  <span>config.json</span>
                  <button
                    onClick={() =>
                      handleCopyCode(`{
  "keyboard_name": "ElectroCustom-65",
  "layers": [
    {
      "layer": 0,
      "mapping": {
        "CAPS": "ESC",
        "R_ALT": "LAYER_1",
        "L_CMD": "L_CTRL"
      }
    }
  ],
  "rgb_backlight": {
    "effect": "breath",
    "primary_color": "#0df259"
  }
}`)
                    }
                    className="flex items-center gap-1 text-xs hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    Copy
                  </button>
                </div>
                <pre className="p-6 overflow-x-auto">
                  <code>{`{
  "keyboard_name": "ElectroCustom-65",
  "layers": [
    {
      "layer": 0,
      "mapping": {
        "CAPS": "ESC",
        "R_ALT": "LAYER_1",
        "L_CMD": "L_CTRL"
      }
    }
  ],
  "rgb_backlight": {
    "effect": "breath",
    "primary_color": "#0df259"
  }
}`}</code>
                </pre>
              </div>

              <blockquote className="border-l-4 border-primary pl-6 py-2 my-8">
                <p className="text-lg font-medium text-slate-800">
                  "The transition from a standard laptop keyboard to a 75% mechanical board increased my typing speed
                  by 15 WPM within the first week."
                </p>
              </blockquote>

                  <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Best Switches for Coding</h2>
                  <p className="text-slate-700 leading-relaxed">
                    While gamers prefer linear switches (Red), developers often find tactile switches (Brown) or clicky
                    switches (Blue) more satisfying for long coding sessions. The subtle "bump" helps prevent bottoming
                    out, which can reduce finger fatigue.
                  </p>
                </>
              )}
            </div>

            {/* Tags & Engagement */}
            <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2">
                {blogPost.tags.map((tag) => (
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
                <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 hover:border-primary transition-all group">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                    thumb_up
                  </span>
                  <span className="font-bold">{blogPost.likes}</span>
                </button>
                <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                  <span className="material-symbols-outlined">bookmark</span>
                </button>
                <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                  <span className="material-symbols-outlined">share</span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <section className="mt-16">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                Comments
                <span className="text-slate-400 text-lg font-normal">({blogPost.comments})</span>
              </h3>

              {/* Comment Input */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 mb-10">
                <div className="flex gap-4">
                  <div className="size-10 shrink-0 rounded-full bg-slate-200 overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      alt="User profile avatar"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5MCylWTqvm5VGGusDvVYItImgLfGeVM-xhhjcGxD1jLiIgP08qQqMHu6Ou9potKVx0aF3CaTxOP_9GO2XLnzo9rEjyRiNPx5a73I4_KZGomwmLawIfV-pFRFGJFAFuVKepLygqBYIO8aJsnt9sCYN2jyPtlfizS1JmSCmef760N4FJSwbIM-9HWxdoE766aXIboAl-eCScKqJH7CjIu3M2HT7nFFXo2UKIJpTOqzynMXAKCjvEP48VTm5AMmqoJfjlTRx90VqRY7T"
                    />
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

              {/* Individual Comment */}
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="size-10 shrink-0 rounded-full bg-slate-200 overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      alt="User avatar for Rohan"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiklxJ2yhVuzH-OFAhePSh_JZ6WmMqWTEzuzKp7ViALl1J9vx7YhUkqWHLe3q1xQnCkeNmoCjh9rwj62qDTspWpakXyEf3vxyCttpRbLXNtKXxQOJ36KAZ2oQBmUm85LvsCO1xJZZD0PxhnLgluD6Us1qsWOcpuwtXB8whmnovNooYN1RcQ8nvw8o2tw5JUmLROj8NA-hm9ZPnRhmqY-TUyuMG_o-3jp8jgHFWI7ucPPguUeZrBuPazCtpvWk93nHT8gnfbPi4Z-IQ"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">Rohan Verma</span>
                      <span className="text-xs text-slate-500">• 2 hours ago</span>
                    </div>
                    <p className="text-slate-600 text-sm mb-2">
                      Great article! I'm currently using a Keychron K2 with Gateron Browns. The tactile bump is exactly
                      what I needed for long typing sessions.
                    </p>
                    <button className="text-xs font-bold text-primary hover:underline">Reply</button>
                  </div>
                </div>
              </div>
            </section>
          </article>

          {/* Sidebar (4 cols) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Related Products */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">shopping_bag</span>
                  Related Products
                </h4>
                <div className="space-y-6">
                  {relatedProducts.map((product) => (
                    <Link key={product.id} href={`/product/${product.id}`} className="group flex gap-4">
                      <div className="size-20 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                        <img
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          alt={product.name}
                          src={product.image}
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <div>
                          <h5 className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-1">
                            {product.name}
                          </h5>
                          <p className="text-primary font-bold text-sm mt-1">₹{product.price.toLocaleString('en-IN')}</p>
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
                  href="/products?category=keyboards"
                  className="w-full mt-6 py-3 bg-slate-100 rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors block text-center"
                >
                  Shop All Keyboards
                </Link>
              </div>

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
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={post.title}
                    src={post.image}
                  />
                </div>
                <span className="text-xs font-bold text-primary uppercase mb-2 block">{post.category}</span>
                <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{post.title}</h4>
                <p className="text-sm text-slate-500 mt-2">{post.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

