'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, Thumbs, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/effect-fade';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  featuredImage: string;
  category: string;
  readTime: string;
  date: string;
  isFeatured: boolean;
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Stories');
  const [email, setEmail] = useState('');
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch('/api/admin/blogs')
      .then((res) => res.json())
      .then((data) => setBlogs(Array.isArray(data) ? data : []))
      .catch((e) => console.error('Error loading blogs:', e))
      .finally(() => setLoading(false));
  }, []);

  // Use all blogs with images for the carousel (up to 8), fall back to all
  const carouselPosts = blogs.filter((b) => b.featuredImage).slice(0, 8);

  // Unique categories derived from fetched blogs
  const categories = [
    'All Stories',
    ...Array.from(new Set(blogs.map((b) => b.category).filter(Boolean))),
  ];

  const filteredPosts =
    selectedCategory === 'All Stories'
      ? blogs
      : blogs.filter((post) => post.category === selectedCategory);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog' },
          ]}
        />

        {/* ── Hero Carousel ── */}
        <section className="mb-12 mt-6">
          {loading ? (
            /* Skeleton */
            <div className="rounded-2xl overflow-hidden">
              <div className="h-[480px] bg-slate-200 animate-pulse rounded-2xl mb-3" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 flex-1 bg-slate-200 animate-pulse rounded-lg" />
                ))}
              </div>
            </div>
          ) : carouselPosts.length === 0 ? null : (
            <div className="space-y-3">
              {/* ── Main Big Slide ── */}
              <div className="relative rounded-2xl overflow-hidden group">
                <Swiper
                  modules={[Autoplay, Pagination, Navigation, Thumbs, EffectFade]}
                  effect="fade"
                  spaceBetween={0}
                  slidesPerView={1}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  pagination={{
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet !bg-white/50 !w-2 !h-2',
                    bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary !w-6 !rounded-full',
                  }}
                  navigation={{
                    nextEl: '.blog-swiper-next',
                    prevEl: '.blog-swiper-prev',
                  }}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  loop={carouselPosts.length > 1}
                  onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                  className="h-[480px] w-full"
                >
                  {carouselPosts.map((post) => (
                    <SwiperSlide key={post.id}>
                      <Link href={`/blog/${post.slug}`} className="block w-full h-full relative">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 scale-105 group-hover:scale-100"
                        />
                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 rounded-full bg-primary text-white text-[11px] font-bold uppercase tracking-widest">
                              {post.category}
                            </span>
                            {post.isFeatured && (
                              <span className="px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1">
                                ⭐ Featured
                              </span>
                            )}
                          </div>
                          <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3 leading-tight line-clamp-2">
                            {post.title}
                          </h2>
                          <p className="text-slate-300 text-sm md:text-base mb-5 line-clamp-2 max-w-2xl">
                            {post.description}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary/90 transition-all">
                              Read Article
                              <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </span>
                            {post.readTime && (
                              <span className="text-slate-300 text-sm flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">schedule</span>
                                {post.readTime}
                              </span>
                            )}
                            <span className="text-slate-300 text-sm">{post.date}</span>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom Nav Arrows */}
                <button className="blog-swiper-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/40 transition-all">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="blog-swiper-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/40 transition-all">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>

                {/* Slide counter */}
                <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-black/40 backdrop-blur rounded-full text-white text-xs font-bold">
                  {activeIndex + 1} / {carouselPosts.length}
                </div>
              </div>

              {/* ── Thumbnail Strip ── */}
              {carouselPosts.length > 1 && (
                <Swiper
                  modules={[Thumbs]}
                  onSwiper={setThumbsSwiper}
                  spaceBetween={8}
                  slidesPerView={Math.min(carouselPosts.length, 6)}
                  watchSlidesProgress
                  className="thumbs-swiper h-20 w-full"
                  breakpoints={{
                    0:   { slidesPerView: Math.min(carouselPosts.length, 3) },
                    640: { slidesPerView: Math.min(carouselPosts.length, 4) },
                    768: { slidesPerView: Math.min(carouselPosts.length, 5) },
                    1024:{ slidesPerView: Math.min(carouselPosts.length, 6) },
                  }}
                >
                  {carouselPosts.map((post, i) => (
                    <SwiperSlide key={post.id} className="!h-20 cursor-pointer rounded-xl overflow-hidden relative">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-all duration-300"
                      />
                      <div className={`absolute inset-0 transition-all duration-300 ${activeIndex === i ? 'bg-primary/30 ring-2 ring-primary' : 'bg-black/30 hover:bg-black/10'} rounded-xl`} />
                      <span className="absolute bottom-1 left-0 right-0 text-center text-[9px] text-white font-bold truncate px-1">
                        {post.category}
                      </span>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          )}
        </section>

        {/* ── Category Filter Bar ── */}
        <section className="mb-10 sticky top-[64px] z-40 py-4 bg-white/95 backdrop-blur-sm border-b border-slate-200">
          <div className="flex items-center justify-between overflow-x-auto scrollbar-hide gap-2">
            <div className="flex gap-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full font-semibold text-sm transition-all whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-white text-slate-600 hover:bg-primary/10 hover:text-primary border border-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200 ml-4 hidden md:flex shrink-0">
              <span className="text-sm font-medium text-slate-500">Sort by:</span>
              <button className="text-sm font-bold flex items-center gap-1">
                Latest
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── Blog Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                <div className="aspect-video bg-slate-200 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-1/3" />
                  <div className="h-6 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined text-7xl text-slate-300 mb-4">article</span>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No blogs found</h3>
            <p className="text-slate-500">Try a different category or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100"
              >
                <Link href={`/blog/${post.slug}`} className="relative aspect-video overflow-hidden">
                  {post.featuredImage ? (
                    <img
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={post.featuredImage}
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-slate-300">image</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur text-white text-[10px] font-bold uppercase tracking-widest">
                      {post.category}
                    </span>
                    {post.isFeatured && (
                      <span className="px-2 py-1 rounded-lg bg-yellow-400 text-yellow-900 text-[10px] font-bold uppercase tracking-widest">
                        ⭐
                      </span>
                    )}
                  </div>
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5 line-clamp-2">{post.description}</p>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">schedule</span>
                      {post.readTime || '—'}
                    </span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Count */}
        {!loading && filteredPosts.length > 0 && (
          <div className="flex justify-center mt-10 pb-8">
            <p className="text-sm text-slate-400">Showing <strong>{filteredPosts.length}</strong> of <strong>{blogs.length}</strong> articles</p>
          </div>
        )}

        {/* ── Newsletter ── */}
        <section className="bg-primary/5 rounded-2xl p-8 md:p-12 mb-16 border border-primary/10 mt-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Ahead of the Tech Curve</h2>
            <p className="text-slate-600 mb-8">
              Get the latest deep-dives, build guides, and industry news delivered straight to your inbox every Friday.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                placeholder="Your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-4 text-[10px] text-slate-400 uppercase tracking-widest">No spam. Ever. Unsubscribe anytime.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
