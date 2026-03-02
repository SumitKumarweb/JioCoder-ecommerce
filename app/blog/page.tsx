'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';

const featuredPosts = [
  {
    id: 'featured-1',
    title: 'Building the Ultimate Mechanical Keyboard',
    description:
      'From selecting the perfect switches to lubing stabilizers, here is everything you need to know about crafting your dream typing experience.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBCjQ2IV-Vws-XgqGs68uwrgOtTrLtZhQ_QawS59sBZ7OEG89FMz8lYrfqt75MgfCgDkGJlXUmpXo20S6A9SeAUFvQ5RWzxSFHzdXwtme6SGC1o4gCwFFmwyASQ3xLLkWMkc3WK9WvLKQF3pgDulXLhYXrotdoGOBJKCrohuivbOXNWum67uIf0dO4pP4h6Or7f7LnOjig7KZW9wtF18dwJqxqNuVXuEgFA51CBdIj3Ecbx0Lz5lgK0FtAaJmdVSDxIF1RGH1Ie9oY4',
    readTime: '12 min read',
    category: 'Featured Guide',
  },
  {
    id: 'featured-2',
    title: 'The Future of Gaming Peripherals',
    description:
      'Exploring the latest innovations in gaming mice, keyboards, and headsets that are revolutionizing competitive gaming.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBYPfRgrEJoJQJPNIMnpFBAC_ZA2ZH8MAsBGoTY-y7q3vb4vcWa9aEVQusc4XiE3hfrH_D7ZiBJIp1dfUjg-BESOP6_LROLBDF_QAHe92Gc7HpKdDSoBl4DcV1hCNFlhZUoHI2RsZn65ceYa0FQljR4kGhaH1TUZ8yn1pdiX8Ka6-zLh4FuAnUOMh6aLQ77ZVYkjBXqvlX_sBVQxYpE_ai-aXZv98RFg7_PyLrhHkRvEvssKKSL-kjmen9OuRc8pyBrLoeUr5fKygat',
    readTime: '15 min read',
    category: 'Gaming',
  },
  {
    id: 'featured-3',
    title: 'Professional Audio Setup Guide',
    description:
      'Complete guide to building a professional audio workstation for content creators and music producers.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDTeHZOFCB-WD8OKgGUIhMX5PZiWMxh6qpGbWYa1vjxFfTqgq0dTOl8Sjo3fUMV4kU9QqbkuqDX8BK5tsz6G4X8qsebWjSnJWZIW92U9qi-DidpG4hkPQDyMpHNxZFufoDjsgB079ydlq6tEC6dMRyJ0ZrKaDnggJaPJNUbBVz0XjZE6Oj7M2nPlUxkmXJwhqeDR8Nsdr7UWpE4E23oVyOONM6_fIWNjviwYdEBsE9ODV-ydQAUJFJvSpRlSlmBi4C8oM21Iw2V4rWw',
    readTime: '18 min read',
    category: 'Electronics',
  },
];

const blogPosts = [
  {
    id: 'post-1',
    title: 'Choosing the Right GPU for 4K Gaming',
    description:
      'The landscape of graphics cards is changing fast. We break down benchmarks for the latest RTX and RX series to see what actually drives 4K performance.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBYPfRgrEJoJQJPNIMnpFBAC_ZA2ZH8MAsBGoTY-y7q3vb4vcWa9aEVQusc4XiE3hfrH_D7ZiBJIp1dfUjg-BESOP6_LROLBDF_QAHe92Gc7HpKdDSoBl4DcV1hCNFlhZUoHI2RsZn65ceYa0FQljR4kGhaH1TUZ8yn1pdiX8Ka6-zLh4FuAnUOMh6aLQ77ZVYkjBXqvlX_sBVQxYpE_ai-aXZv98RFg7_PyLrhHkRvEvssKKSL-kjmen9OuRc8pyBrLoeUr5fKygat',
    category: 'Gaming',
    readTime: '5 min read',
    date: 'Oct 24, 2024',
  },
  {
    id: 'post-2',
    title: 'Minimalist Desk Setups for Developers',
    description:
      'How professional software engineers curate their workspace to minimize distractions and maximize deep work sessions. Less is more.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAScaW0ZZslu-txci1CARmeR8x8p2r0cay9oBfCZacXOA5VRHUIzrMOQMhJFK9MAjWkKaC5kccbvVtdtkOkizfFr-K5nfQRSUTyCIhjD7L_tjLioC9X66tjvq8e871aweOVn8AmoOUbG-G0TeLW7NsjWK0Oc-u2cs5Wfatbw8f7-EQgVMUZXgKbd47gWtAkS7-VLIQg7q3mcaV_c8qkuQIYT3CDgM7idk0xUoAblG6mvSCnP7LCyz_-aigDBSpTzt95h1D33taRfRGO',
    category: 'Coding',
    readTime: '8 min read',
    date: 'Oct 22, 2024',
  },
  {
    id: 'post-3',
    title: 'The Rise of RISC-V in Consumer Tech',
    description:
      'Is ARM\'s dominance under threat? We explore how the open-standard RISC-V architecture is finally making its way into consumer electronics.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjclpSmCi2oTYCrLzTI-sWZpAj6gKz6tcsghlLdOwys1uyzKoopqJWtJDo24TAHcEcsq1-roZwpVfRKB_aazuqleVaX3KKTXSpPbjAInJexJY1ezEOYwOA3JwVeBoESFzx9mys39MrVcjP_Lw-IonRz2XxizT6UEZ1SLAJpilX3BFYFrevsprGSP27XGnu08MzrYqzqENE9q-V-OHjGVCpDpYyHYkdJFBGb97HI_l5kh608RhAcxXlBmtM_YTAxIHh_1EuAHBz-MWs',
    category: 'Electronics',
    readTime: '10 min read',
    date: 'Oct 20, 2024',
  },
  {
    id: 'post-4',
    title: 'Essential Coding Gadgets for 2024',
    description:
      'From portable monitors to ergonomic mice, these are the gadgets that actually improved our productivity this year.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCg9--j0dHDUY8xsI3-F3_082IKydS1MvD-QQ4oiChZ_CKxbms_roSATF5rGK7lTvUdhK4WRMKPGfuMYvp-v1o7_lYHguThg9hq4cp2ynJCWLVzji2nL4OX8fZM7cjvYm10iudv8XkDSTqTsKe5o1d5QhJvro-5az3O6xEJAZOZz4mJMguktLcoDehXxMOX2Tg8jD_QBnrF7Xgwr1tTnanLLO8-15vG_QxSF39tlrGKN8RyDNXFaIBCVQ8N55P7Mcm0xZ-g2fVGF766',
    category: 'News',
    readTime: '6 min read',
    date: 'Oct 18, 2024',
  },
  {
    id: 'post-5',
    title: 'Audiophile Gear: Worth the Investment?',
    description:
      'Exploring the point of diminishing returns in high-end audio equipment. When do those $500 cables actually matter?',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDTeHZOFCB-WD8OKgGUIhMX5PZiWMxh6qpGbWYa1vjxFfTqgq0dTOl8Sjo3fUMV4kU9QqbkuqDX8BK5tsz6G4X8qsebWjSnJWZIW92U9qi-DidpG4hkPQDyMpHNxZFufoDjsgB079ydlq6tEC6dMRyJ0ZrKaDnggJaPJNUbBVz0XjZE6Oj7M2nPlUxkmXJwhqeDR8Nsdr7UWpE4E23oVyOONM6_fIWNjviwYdEBsE9ODV-ydQAUJFJvSpRlSlmBi4C8oM21Iw2V4rWw',
    category: 'Electronics',
    readTime: '7 min read',
    date: 'Oct 15, 2024',
  },
  {
    id: 'post-6',
    title: 'Building a Silent Gaming PC',
    description:
      'Performance without the noise. Our guide to choosing the best silent cases, fans, and semi-passive power supplies.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA1MYGj6Qy3NW19jD4Nn95aT6vut7NYAnTl0R5tZhK1Dnxc3Vw_aI4TOYtgc7GjWftwfgJtoXVW-_2hcAiA7zrkgu8P-2OHcoYlAvwAojF_E0QReewKQDnj1At9TS1_0zl2ziSOmcSVeYSMm6PnVB9APSM16LTB28TKu9rmmwvlmqTJfKU7S9GyWd4mPMSbekNOoFcSRXA1VXo9YPY-7jfxFaD5VhMgmAp3jsjWtaOkQrTBTEqUHgR_b-JkpsqZCTrB8bkrhcLNsFhN',
    category: 'Setup Tours',
    readTime: '9 min read',
    date: 'Oct 12, 2024',
  },
];

const categories = ['All Stories', 'Electronics', 'Coding', 'Gaming', 'Setup Tours', 'News'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Stories');
  const [email, setEmail] = useState('');

  const filteredPosts =
    selectedCategory === 'All Stories'
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
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

        {/* Featured Post Hero with Swiper */}
        <section className="mb-12 mt-6">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-white/50',
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary',
            }}
            loop={true}
            className="featured-swiper"
          >
            {featuredPosts.map((post) => (
              <SwiperSlide key={post.id}>
                <Link
                  href={`/blog/${post.id}`}
                  className="relative h-[500px] w-full overflow-hidden rounded-xl group cursor-pointer block"
                >
                  <img
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={post.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-3xl">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider mb-4">
                      {post.category}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{post.title}</h2>
                    <p className="text-slate-200 text-lg mb-6 line-clamp-2">{post.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2">
                        Read Guide
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </span>
                      <span className="text-slate-300 text-sm font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Category Filter Bar */}
        <section className="mb-10 sticky top-[64px] z-40 py-4 bg-white/95 backdrop-blur-sm border-b border-slate-200">
          <div className="flex items-center justify-between pb-4 overflow-x-auto scrollbar-hide">
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
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200 ml-4 hidden md:flex">
              <span className="text-sm font-medium text-slate-500">Sort by:</span>
              <button className="text-sm font-bold flex items-center gap-1">
                Latest
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
            </div>
          </div>
        </section>

        {/* Main Body: Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100"
            >
              <Link href={`/blog/${post.id.toLowerCase().replace(/\s+/g, '-')}`} className="relative aspect-video overflow-hidden">
                <img
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={post.image}
                />
                <span className="absolute top-4 left-4 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest">
                  {post.category}
                </span>
              </Link>
              <div className="p-6 flex flex-col flex-1">
                <Link href={`/blog/${post.id.toLowerCase().replace(/\s+/g, '-')}`}>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">{post.description}</p>
                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">schedule</span>
                    {post.readTime}
                  </span>
                  <span>{post.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Section */}
        <div className="flex flex-col items-center justify-center mt-16 pb-16">
          <button className="px-8 py-3 bg-white border border-slate-200 text-slate-900 font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm mb-4">
            Load More Articles
          </button>
          <p className="text-xs text-slate-500">Showing {filteredPosts.length} of 142 articles</p>
        </div>

        {/* Newsletter Subscription */}
        <section className="bg-primary/5 rounded-2xl p-8 md:p-12 mb-16 border border-primary/10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Ahead of the Tech Curve</h2>
            <p className="text-slate-600 mb-8">
              Get the latest deep-dives, build guides, and industry news delivered straight to your inbox every Friday.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="Your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all"
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

