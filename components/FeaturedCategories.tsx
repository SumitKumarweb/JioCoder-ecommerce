export default function FeaturedCategories() {
  const categories = [
    {
      name: "Mouse Pads",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUuF1Tp2OQwl4ZcwIYnoPlMn05i9umoW5eaHxwxtpfbTCaK2avQqZln8FS3uW4YJu0Igiu_44aN5rueJLPl3RiPtaeTL0-3Sd7KMOKMzYaNFarJ22INs8uCqbO0SI4SJ1kDizPd7lqChN8PV97H1uz3z6OHox1gcpPYuoSt53UrMIrCiYnhJ_Y0lDi7_S3Kf0Vh-OP39jHCCDJe7E8aGFHz6gxklTDoG2-A2_el3BECN-iZ_ba1Q_9Fv991ECfpWfC4uuy4c4nEs8o",
    },
    {
      name: "Keyboard Pads",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvGH-EeXfLPuwhzrnO3Ynx3TvEgLyyf3w9A7Ku9MYJXzUSg2T6V66y2UeVfWRXErQGUzLuau8p2vpuruuQI1DMHt3I-DPjPhiMgfM9GuKqeglLmHGiJbgkvgwj0Q38TiqNwiDFfSAbkM-W7hONdowZfcjqeXqcrrt8bFfzniZIvddBpqwFYuA-vQhuRaxLg3hFgLl3sNDGXaMsza6QqOHuBVFNN1S15yKqDUR5vZm1mcbCFowTeykGjZIINx45hBbvsEciIvsTgQnL",
    },
    {
      name: "USB Cables",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWOvP1R8IJO4522_t8YwGqfG64pVnKfLnwYxllNqEkk9b9m7mU1BVZOvxjS7WNfNcg3RjXxrk8vopMjzrMAwsCjw5lK7Z5PwrJE4pledhAXNo9gHg26XuQhnR23aEwFZZYw2y7v_FAL9FJVD2eDF1VXZZPhakgHBeL67o-C9lEFv3jcubO4cTkvLEmSw8jHZ6spwv_laBb4yv5LOaGE_0PrrQKtvfjRoJIWasLcsiO4t8_kqgrRqF_-LMPnfoOXbGQzFRXeyUY5JmC",
    },
    {
      name: "Keyboards",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKQyC6WFTf8MJOcWjJFwxdZ56gafGjIO355ezHoArGqNVxMvTh7rSuWRStgoQ2e0SCBcXgVU0QW2IYM3qSa4FZMO9-MIfH_KWadR2rwSHDAF9YZen4Z-E3y1tXF3GrXMChtxeB4u_v4nEJHTWnabdNueSJS0SWbBkwWIKtXFz1Iqlu2JGFHU7MJ3YOZ6O9b_lFV_W3fizQDFR7wleMqzOZ8a16yecgjjuiSvZ_4-WpIfo-W-_npJyLCHNUZJRXbJHkW3BfxMHrQOxh",
    },
    {
      name: "Mouse",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7pqAe9FhogQPescCwg25uS_lHUhAD4fx956xXVlL_ufPTZkHumFcKqS4B5PdipKw_lbAxHGq1Gd53aUJB4ZX_PNzxP18D_3xpbV1PRVGxEH5SE3rpRcY71s9fKuvdCaVN5_jqJnqtC1yup7iv6n1cYUQj2doA_CcAOJeqRLoA2hb559SDFaNS8cvkdLs9UiXCCZIXYuvoHkYDNUZc9j9NeSxQzW9uIKlgSODd9ciEj4bsz2V9bR0mJLK6ls-p-SpgXqgV0ZgWzFlA",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">
          Featured Categories
        </h3>
        <a
          className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline"
          href="#"
        >
          View All
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((category, index) => (
          <a key={index} className="group text-center space-y-3" href="#">
            <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 p-4 transition-all group-hover:shadow-md group-hover:border-primary/20">
              <img
                alt={category.name}
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform"
                src={category.image}
              />
            </div>
            <p className="font-semibold text-sm lg:text-base group-hover:text-primary transition-colors">
              {category.name}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}

