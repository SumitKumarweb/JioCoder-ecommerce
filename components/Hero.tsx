'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export type HeroSlide = {
  id: string;
  image: string;
  tag?: string;
  title: string;
  subtitle?: string;
  url?: string;
  buttonText?: string;
  enabled?: boolean;
};

export default function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const res = await fetch('/api/hero');
        if (!res.ok) {
          throw new Error(`Failed to fetch hero slides: ${res.status}`);
        }
        const data: HeroSlide[] = await res.json();
        setSlides(data || []);
      } catch (error) {
        console.error('Failed to load hero slides from API', error);
      }
    };

    loadSlides();
  }, []);

  const visibleSlides = slides.filter((slide) => slide.enabled !== false);

  if (visibleSlides.length === 0) {
    return null;
  }

  return (
    <section className="relative rounded-lg sm:rounded-xl overflow-hidden bg-primary min-h-[280px] h-[320px] sm:min-h-[380px] sm:h-[420px] md:h-[460px] lg:h-[480px]">
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
          bulletClass: 'swiper-pagination-bullet !bg-white/50 !opacity-100',
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-accent-green',
        }}
        loop={visibleSlides.length > 1}
        className="h-full"
      >
        {visibleSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative min-h-[280px] h-[320px] sm:min-h-[380px] sm:h-[420px] md:h-[460px] lg:h-[480px] flex items-center group">
              <div className="absolute inset-0 z-0">
                <img
                  alt={slide.title}
                  className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                  src={slide.image}
                />
              </div>
              <div className="relative z-10 px-4 sm:px-6 md:px-10 lg:px-24 max-w-2xl text-white space-y-3 sm:space-y-4 md:space-y-6">
                {slide.tag && (
                  <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 bg-accent-green/20 text-accent-green rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    {slide.tag}
                  </span>
                )}
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className="text-sm sm:text-base md:text-lg text-slate-300 line-clamp-2 sm:line-clamp-none">
                    {slide.subtitle}
                  </p>
                )}
                {slide.url && slide.buttonText && (
                  <Link
                    href={slide.url}
                    className="inline-flex items-center gap-2 bg-white text-primary px-5 py-2.5 sm:px-8 sm:py-3 rounded-lg text-sm sm:text-base font-bold hover:bg-slate-100 transition-all min-h-[44px]"
                  >
                    {slide.buttonText}
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

