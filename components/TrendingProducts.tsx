'use client';

import { useRef } from 'react';
import { useCompare } from '@/contexts/CompareContext';

const trendingProducts = [
  {
    id: 'trending-1',
    name: 'Arctic Mist PBT Keycap Set',
    price: '₹3,499',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvGH-EeXfLPuwhzrnO3Ynx3TvEgLyyf3w9A7Ku9MYJXzUSg2T6V66y2UeVfWRXErQGUzLuau8p2vpuruuQI1DMHt3I-DPjPhiMgfM9GuKqeglLmHGiJbgkvgwj0Q38TiqNwiDFfSAbkM-W7hONdowZfcjqeXqcrrt8bFfzniZIvddBpqwFYuA-vQhuRaxLg3hFgLl3sNDGXaMsza6QqOHuBVFNN1S15yKqDUR5vZm1mcbCFowTeykGjZIINx45hBbvsEciIvsTgQnL',
    compareId: 'compare-1',
  },
  {
    id: 'trending-2',
    name: 'Air75 V2 Low-Profile Keyboard',
    price: '₹12,999',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKQyC6WFTf8MJOcWjJFwxdZ56gafGjIO355ezHoArGqNVxMvTh7rSuWRStgoQ2e0SCBcXgVU0QW2IYM3qSa4FZMO9-MIfH_KWadR2rwSHDAF9YZen4Z-E3y1tXF3GrXMChtxeB4u_v4nEJHTWnabdNueSJS0SWbBkwWIKtXFz1Iqlu2JGFHU7MJ3YOZ6O9b_lFV_W3fizQDFR7wleMqzOZ8a16yecgjjuiSvZ_4-WpIfo-W-_npJyLCHNUZJRXbJHkW3BfxMHrQOxh',
    compareId: 'compare-2',
  },
  {
    id: 'trending-3',
    name: 'Logitech G Pro X Superlight',
    price: '₹11,495',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKPTnPR2ZYt_a6VaISccTem49dOMrTwIeqIByZotD0MSDbynXY1x4jRH3kg8-Zh-qrbNn1w0WLg2nfSAzcB8STxJNCIKxO5SUb6EHtAd-_H9SntE78Ey0byBkeSf2PMVLS-ndiYmeQaWRKT5ZdiF4DIJh837aYSuixZD12MhQQN2TxFwEvl014VM1X3bhPHDJmuFIxzRrjbiYKMIu6nIdy13CpeF94iJsBTtzZLSLKI4FKoZrqif0csbfYmFwMxn0qhzkkrBNVyjWB',
    compareId: 'compare-3',
  },
  {
    id: 'trending-4',
    name: 'Onyx Felt Large Desk Pad',
    price: '₹1,899',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUuF1Tp2OQwl4ZcwIYnoPlMn05i9umoW5eaHxwxtpfbTCaK2avQqZln8FS3uW4YJu0Igiu_44aN5rueJLPl3RiPtaeTL0-3Sd7KMOKMzYaNFarJ22INs8uCqbO0SI4SJ1kDizPd7lqChN8PV97H1uz3z6OHox1gcpPYuoSt53UrMIrCiYnhJ_Y0lDi7_S3Kf0Vh-OP39jHCCDJe7E8aGFHz6gxklTDoG2-A2_el3BECN-iZ_ba1Q_9Fv991ECfpWfC4uuy4c4nEs8o',
    compareId: 'compare-4',
  },
  {
    id: 'trending-5',
    name: 'Carbon Fiber Coiled Aviator Cable',
    price: '₹2,299',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgdShxLlKCypMs41C4ireig29gMbYTcanzcugGp8t-hCCcH_Bbydd3W8vCLPbdtGLpSXlecsJdUMyEZ-R4i7d56copAT6erQtq1DkZiY77ZFMnlBetA9tX24i75RATOLlC7Agaffx_2fpn0jNJndIDhahEGWK-Imu1QevPVpOZSfabGlFPLjePlxNSS2hp3EGuNRrsoQsDtjEYf_jq9pwnJHYLnQ9yCq8HZLNBS9Ivrh3oJH5kktTCbvODwFUo5iwnmnjxVUCx-0NL',
    compareId: 'compare-5',
  },
];

export default function TrendingProducts() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -320,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 320,
        behavior: 'smooth',
      });
    }
  };

  const handleCompareChange = (product: typeof trendingProducts[0], checked: boolean) => {
    if (checked) {
      addToCompare({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
      });
    } else {
      removeFromCompare(product.id);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-orange-500 fill-1">
            trending_up
          </span>
          <h3 className="text-2xl font-bold tracking-tight">Trending Right Now</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={scrollRight}
            className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-6 pb-4 no-scrollbar"
      >
        {trendingProducts.map((product) => (
          <div
            key={product.id}
            className="min-w-[300px] bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 flex flex-col transition-all hover:shadow-md group"
          >
            <a href={`/product/${product.id}`} className="relative aspect-square bg-slate-50 overflow-hidden block">
              <span className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] fill-1">bolt</span>
                Trending
              </span>
              <img
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={product.image}
              />
              <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-slate-900 hover:bg-white transition-colors z-10">
                <span className="material-symbols-outlined text-xl">favorite</span>
              </button>
            </a>
            <div className="p-4 flex-1 flex flex-col space-y-2">
              <a href={`/product/${product.id}`} className="font-semibold text-base line-clamp-1 hover:text-primary transition-colors">
                {product.name}
              </a>
              <p className="text-xl font-bold">{product.price}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <input
                  className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                  id={product.compareId}
                  type="checkbox"
                  checked={isInCompare(product.id)}
                  onChange={(e) => handleCompareChange(product, e.target.checked)}
                />
                <label
                  className="text-xs font-medium text-slate-600 cursor-pointer"
                  htmlFor={product.compareId}
                >
                  Add to compare
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

