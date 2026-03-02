'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const heroSlides = [
  {
    id: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2szADM5ISIXlgO-jmeh_WgCinJ9UftMKB7j6hbRvTZD5ugGjePtpr6m6DVHlXAPcWT6auCrnysq7_CpQwCJnpNpXlF2CwFWG46ax5ECUikI41JhnjQiN_2MxhxVr4VP_vnIIKjaaWwjTH7fUC2MvhBjuJL2RWLMZXlW9j-wgVELmIfI4q2tkSXebnBWq05UTZ9Rh8jilVaLs2osLyifV7aJuTcEgQyi5mJEZ2CK_sUwrFtxkOuHmN7uvsM8f-3Y_3Dq09Cx5Zgvfo',
    badge: 'New Arrival',
    title: 'Precision at your fingertips',
    description: 'Engineered for enthusiasts. Explore our curated collection of artisanal mechanical keyboards and bespoke switches.',
    buttonText: 'Shop Now',
  },
  {
    id: 2,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVA_-B12wrZHmkzZ0JS_w6YqBEeiWUHL-yo3FEwx9c9gXaJTZSRmBDVKQi4WgAoT1pgIxToDSiT6FRcVKmxerqeO-f9IYBLjIf0ZuyfqFNRhxhDS5Kuo3dGmO2L1BWOd88iu9s6hysFVNVyYWJ_qsjVHKMTsKJeYiMca5mmQ-CvDEDa-H62n7_lAGLE0RXrB0xGRSjU24V7KGl_DwmxjY830FIxC9VpaX14WXWTlwTLNARvo7gzXP97WcgP6hiEXeD8KwXmgJVHRyT',
    badge: 'Featured',
    title: 'Premium Mechanical Keyboards',
    description: 'Discover the perfect typing experience with our handpicked selection of premium mechanical keyboards.',
    buttonText: 'Explore Keyboards',
  },
  {
    id: 3,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKPTnPR2ZYt_a6VaISccTem49dOMrTwIeqIByZotD0MSDbynXY1x4jRH3kg8-Zh-qrbNn1w0WLg2nfSAzcB8STxJNCIKxO5SUb6EHtAd-_H9SntE78Ey0byBkeSf2PMVLS-ndiYmeQaWRKT5ZdiF4DIJh837aYSuixZD12MhQQN2TxFwEvl014VM1X3bhPHDJmuFIxzRrjbiYKMIu6nIdy13CpeF94iJsBTtzZLSLKI4FKoZrqif0csbfYmFwMxn0qhzkkrBNVyjWB',
    badge: 'Limited Edition',
    title: 'Artisan Collection',
    description: 'Exclusive designs crafted for the discerning enthusiast. Limited edition keyboards and accessories.',
    buttonText: 'View Collection',
  },
  {
    id: 4,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKQyC6WFTf8MJOcWjJFwxdZ56gafGjIO355ezHoArGqNVxMvTh7rSuWRStgoQ2e0SCBcXgVU0QW2IYM3qSa4FZMO9-MIfH_KWadR2rwSHDAF9YZen4Z-E3y1tXF3GrXMChtxeB4u_v4nEJHTWnabdNueSJS0SWbBkwWIKtXFz1Iqlu2JGFHU7MJ3YOZ6O9b_lFV_W3fizQDFR7wleMqzOZ8a16yecgjjuiSvZ_4-WpIfo-W-_npJyLCHNUZJRXbJHkW3BfxMHrQOxh',
    badge: 'Best Seller',
    title: 'Gaming Peripherals',
    description: 'Elevate your gaming setup with our premium gaming mice, keyboards, and accessories.',
    buttonText: 'Shop Gaming',
  },
];

export default function Hero() {
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
        loop={true}
        className="h-full"
      >
        {heroSlides.map((slide) => (
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
                <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 bg-accent-green/20 text-accent-green rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  {slide.badge}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  {slide.title}
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-slate-300 line-clamp-2 sm:line-clamp-none">
                  {slide.description}
                </p>
                <button className="bg-white text-primary px-5 py-2.5 sm:px-8 sm:py-3 rounded-lg text-sm sm:text-base font-bold hover:bg-slate-100 transition-all flex items-center gap-2 min-h-[44px]">
                  {slide.buttonText}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

