'use client';

import { useCompare } from '@/contexts/CompareContext';
import { useCart } from '@/contexts/CartContext';

const bestSellers = [
  {
    id: 'bestseller-1',
    brand: 'Keychron',
    name: 'K2 Wireless Mechanical Keyboard',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVA_-B12wrZHmkzZ0JS_w6YqBEeiWUHL-yo3FEwx9c9gXaJTZSRmBDVKQi4WgAoT1pgIxToDSiT6FRcVKmxerqeO-f9IYBLjIf0ZuyfqFNRhxhDS5Kuo3dGmO2L1BWOd88iu9s6hysFVNVyYWJ_qsjVHKMTsKJeYiMca5mmQ-CvDEDa-H62n7_lAGLE0RXrB0xGRSjU24V7KGl_DwmxjY830FIxC9VpaX14WXWTlwTLNARvo7gzXP97WcgP6hiEXeD8KwXmgJVHRyT',
    badge: 'Save 15%',
    rating: 4,
    reviews: 128,
    price: '₹8,499',
    originalPrice: '₹9,999',
  },
  {
    id: 'bestseller-2',
    brand: 'Logitech',
    name: 'MX Master 3S Wireless',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKPTnPR2ZYt_a6VaISccTem49dOMrTwIeqIByZotD0MSDbynXY1x4jRH3kg8-Zh-qrbNn1w0WLg2nfSAzcB8STxJNCIKxO5SUb6EHtAd-_H9SntE78Ey0byBkeSf2PMVLS-ndiYmeQaWRKT5ZdiF4DIJh837aYSuixZD12MhQQN2TxFwEvl014VM1X3bhPHDJmuFIxzRrjbiYKMIu6nIdy13CpeF94iJsBTtzZLSLKI4FKoZrqif0csbfYmFwMxn0qhzkkrBNVyjWB',
    badge: 'Top Rated',
    rating: 5,
    reviews: 450,
    price: '₹9,995',
    originalPrice: '₹10,995',
  },
  {
    id: 'bestseller-3',
    brand: 'Glorious',
    name: 'Model O- Lightweight Mouse',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXnDBW3fSizAUrZ3rDyY0N8oBsxZTcTyXhEnkE-quqlp2znS6pBe13Nc6ooE1Y67L5DivsQxEUa1YeI9BY2KEeGEz4bziPlw29DdC3AlrEGO7RWx9xG7voi8pKEz0xKLSAL_eCZrN5rKS1ufnWR1If-JnGZbDfz2os0oftjy-7YvpN73BhPYBFUYonV0HU6KDUBEvEwblDHfIZpQb5a4YXQbP_jbeIBsY1hnxyPdXNd7WCrbn3PFzswOpEVckWI2HmHDPhhu-Ki7qG',
    badge: 'Best Deal',
    rating: 4,
    reviews: 89,
    price: '₹4,299',
    originalPrice: '₹5,999',
  },
  {
    id: 'bestseller-4',
    brand: 'JioCoder Custom',
    name: 'Pro Coiled Aviator Cable',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgdShxLlKCypMs41C4ireig29gMbYTcanzcugGp8t-hCCcH_Bbydd3W8vCLPbdtGLpSXlecsJdUMyEZ-R4i7d56copAT6erQtq1DkZiY77ZFMnlBetA9tX24i75RATOLlC7Agaffx_2fpn0jNJndIDhahEGWK-Imu1QevPVpOZSfabGlFPLjePlxNSS2hp3EGuNRrsoQsDtjEYf_jq9pwnJHYLnQ9yCq8HZLNBS9Ivrh3oJH5kktTCbvODwFUo5iwnmnjxVUCx-0NL',
    badge: 'Exclusive',
    rating: 5,
    reviews: 56,
    price: '₹1,999',
    originalPrice: '₹2,499',
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`material-symbols-outlined text-sm ${
            star <= rating ? 'fill-1' : 'fill-0'
          }`}
        >
          star
        </span>
      ))}
    </div>
  );
};

export default function BestSellers() {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { addToCart } = useCart();

  const handleCompareChange = (product: typeof bestSellers[0], checked: boolean) => {
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
      <h3 className="text-2xl font-bold tracking-tight">Best Sellers</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {bestSellers.map((product) => (
          <a
            key={product.id}
            href={`/product/${product.id}`}
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 flex flex-col transition-all hover:shadow-xl hover:-translate-y-1 group"
          >
            <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
              <img
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={product.image}
              />
              <button
                onClick={(e) => e.preventDefault()}
                className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-slate-900 hover:bg-white transition-colors z-10"
              >
                <span className="material-symbols-outlined text-xl">favorite</span>
              </button>
            </div>
            <div className="p-5 flex-1 flex flex-col space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                    {product.brand}
                  </p>
                  <h4 className="font-semibold text-lg line-clamp-1">{product.name}</h4>
                </div>
                <span className="bg-accent-green/10 text-accent-green text-xs font-bold px-2 py-1 rounded">
                  {product.badge}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <StarRating rating={product.rating} />
                <span className="text-xs text-slate-500 ml-1">({product.reviews} reviews)</span>
              </div>
              <div className="mt-auto pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                    id={`compare-${product.id}`}
                    type="checkbox"
                    checked={isInCompare(product.id)}
                    onChange={(e) => handleCompareChange(product, e.target.checked)}
                  />
                  <label
                    className="text-xs font-medium text-slate-600 cursor-pointer"
                    htmlFor={`compare-${product.id}`}
                  >
                    Add to compare
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">{product.price}</span>
                    <span className="text-slate-400 line-through text-sm ml-2">
                      {product.originalPrice}
                    </span>
                  </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const priceNumber = parseInt(product.price.replace(/[₹,]/g, ''));
                    addToCart({
                      id: product.id,
                      name: product.name,
                      image: product.image,
                      price: priceNumber,
                    });
                  }}
                  className="bg-primary text-white p-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center"
                >
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                </button>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

