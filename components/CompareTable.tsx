'use client';

import { useCompare } from '@/contexts/CompareContext';

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-1 text-amber-400">
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= fullStars) {
          return (
            <span key={star} className="material-symbols-outlined text-[16px] fill-current">
              star
            </span>
          );
        } else if (star === fullStars + 1 && hasHalfStar) {
          return (
            <span key={star} className="material-symbols-outlined text-[16px] fill-current">
              star_half
            </span>
          );
        } else {
          return (
            <span key={star} className="material-symbols-outlined text-[16px]">
              star
            </span>
          );
        }
      })}
    </div>
  );
};

// Mock product details - in a real app, this would come from an API
const getProductDetails = (productId: string) => {
  const details: Record<string, any> = {
    'trending-1': {
      name: 'Arctic Mist PBT Keycap Set',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvGH-EeXfLPuwhzrnO3Ynx3TvEgLyyf3w9A7Ku9MYJXzUSg2T6V66y2UeVfWRXErQGUzLuau8p2vpuruuQI1DMHt3I-DPjPhiMgfM9GuKqeglLmHGiJbgkvgwj0Q38TiqNwiDFfSAbkM-W7hONdowZfcjqeXqcrrt8bFfzniZIvddBpqwFYuA-vQhuRaxLg3hFgLl3sNDGXaMsza6QqOHuBVFNN1S15yKqDUR5vZm1mcbCFowTeykGjZIINx45hBbvsEciIvsTgQnL',
      rating: 4.5,
      reviews: 428,
      price: '₹3,499',
      stock: 'In Stock',
      stockColor: 'text-green-600',
      switchType: 'PBT Keycaps',
      switchDetail: 'Double-shot ABS',
      connectivity: 'USB-C Wired',
      connectivityDetail: '',
      backlighting: 'SOUTH-FACING RGB',
      backlightingColor: 'bg-primary/10 text-primary',
      backlightingDot: 'bg-primary',
      warranty: '1 Year Standard Domestic Warranty',
    },
    'trending-2': {
      name: 'Air75 V2 Low-Profile Keyboard',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKQyC6WFTf8MJOcWjJFwxdZ56gafGjIO355ezHoArGqNVxMvTh7rSuWRStgoQ2e0SCBcXgVU0QW2IYM3qSa4FZMO9-MIfH_KWadR2rwSHDAF9YZen4Z-E3y1tXF3GrXMChtxeB4u_v4nEJHTWnabdNueSJS0SWbBkwWIKtXFz1Iqlu2JGFHU7MJ3YOZ6O9b_lFV_W3fizQDFR7wleMqzOZ8a16yecgjjuiSvZ_4-WpIfo-W-_npJyLCHNUZJRXbJHkW3BfxMHrQOxh',
      rating: 4.0,
      reviews: 892,
      price: '₹12,999',
      stock: 'In Stock',
      stockColor: 'text-green-600',
      switchType: 'Low-Profile Mechanical',
      switchDetail: 'NuPhy Red Linear',
      connectivity: 'USB-C Wired',
      connectivityDetail: 'Bluetooth 5.0',
      backlighting: 'PER-KEY RGB',
      backlightingColor: 'bg-green-100 text-green-700',
      backlightingDot: 'bg-green-500',
      warranty: '2 Years International Manufacturer Warranty',
    },
    'trending-3': {
      name: 'Logitech G Pro X Superlight',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKPTnPR2ZYt_a6VaISccTem49dOMrTwIeqIByZotD0MSDbynXY1x4jRH3kg8-Zh-qrbNn1w0WLg2nfSAzcB8STxJNCIKxO5SUb6EHtAd-_H9SntE78Ey0byBkeSf2PMVLS-ndiYmeQaWRKT5ZdiF4DIJh837aYSuixZD12MhQQN2TxFwEvl014VM1X3bhPHDJmuFIxzRrjbiYKMIu6nIdy13CpeF94iJsBTtzZLSLKI4FKoZrqif0csbfYmFwMxn0qhzkkrBNVyjWB',
      rating: 4.5,
      reviews: 1205,
      price: '₹11,495',
      stock: 'Only 4 left',
      stockColor: 'text-red-500',
      switchType: 'Optical',
      switchDetail: 'Hero 25K Sensor',
      connectivity: 'Lightspeed Wireless',
      connectivityDetail: 'USB Receiver',
      backlighting: 'LIGHTSYNC RGB',
      backlightingColor: 'bg-slate-100 text-slate-700',
      backlightingDot: 'bg-slate-400',
      warranty: '2 Years Limited Hardware Warranty',
    },
    'bestseller-1': {
      name: 'K2 Wireless Mechanical Keyboard',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVA_-B12wrZHmkzZ0JS_w6YqBEeiWUHL-yo3FEwx9c9gXaJTZSRmBDVKQi4WgAoT1pgIxToDSiT6FRcVKmxerqeO-f9IYBLjIf0ZuyfqFNRhxhDS5Kuo3dGmO2L1BWOd88iu9s6hysFVNVyYWJ_qsjVHKMTsKJeYiMca5mmQ-CvDEDa-H62n7_lAGLE0RXrB0xGRSjU24V7KGl_DwmxjY830FIxC9VpaX14WXWTlwTLNARvo7gzXP97WcgP6hiEXeD8KwXmgJVHRyT',
      rating: 4.5,
      reviews: 428,
      price: '₹8,499',
      stock: 'In Stock',
      stockColor: 'text-green-600',
      switchType: 'Mechanical',
      switchDetail: 'Keychron K Pro (Brown)',
      connectivity: 'USB-C Wired',
      connectivityDetail: 'Bluetooth 5.1',
      backlighting: 'SOUTH-FACING RGB',
      backlightingColor: 'bg-primary/10 text-primary',
      backlightingDot: 'bg-primary',
      warranty: '1 Year Standard Domestic Warranty',
    },
    'bestseller-2': {
      name: 'MX Master 3S Wireless',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKPTnPR2ZYt_a6VaISccTem49dOMrTwIeqIByZotD0MSDbynXY1x4jRH3kg8-Zh-qrbNn1w0WLg2nfSAzcB8STxJNCIKxO5SUb6EHtAd-_H9SntE78Ey0byBkeSf2PMVLS-ndiYmeQaWRKT5ZdiF4DIJh837aYSuixZD12MhQQN2TxFwEvl014VM1X3bhPHDJmuFIxzRrjbiYKMIu6nIdy13CpeF94iJsBTtzZLSLKI4FKoZrqif0csbfYmFwMxn0qhzkkrBNVyjWB',
      rating: 5.0,
      reviews: 892,
      price: '₹9,995',
      stock: 'In Stock',
      stockColor: 'text-green-600',
      switchType: 'Optical / Mechanical',
      switchDetail: 'Razer Yellow Linear',
      connectivity: 'USB-C Wired',
      connectivityDetail: '8000Hz Polling',
      backlighting: 'PER-KEY CHROMA RGB',
      backlightingColor: 'bg-green-100 text-green-700',
      backlightingDot: 'bg-green-500',
      warranty: '2 Years International Manufacturer Warranty',
    },
    'bestseller-3': {
      name: 'Model O- Lightweight Mouse',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXnDBW3fSizAUrZ3rDyY0N8oBsxZTcTyXhEnkE-quqlp2znS6pBe13Nc6ooE1Y67L5DivsQxEUa1YeI9BY2KEeGEz4bziPlw29DdC3AlrEGO7RWx9xG7voi8pKEz0xKLSAL_eCZrN5rKS1ufnWR1If-JnGZbDfz2os0oftjy-7YvpN73BhPYBFUYonV0HU6KDUBEvEwblDHfIZpQb5a4YXQbP_jbeIBsY1hnxyPdXNd7WCrbn3PFzswOpEVckWI2HmHDPhhu-Ki7qG',
      rating: 4.0,
      reviews: 89,
      price: '₹4,299',
      stock: 'In Stock',
      stockColor: 'text-green-600',
      switchType: 'Mechanical (Swappable)',
      switchDetail: 'GX Blue Clicky',
      connectivity: 'Lightspeed Wireless',
      connectivityDetail: 'Bluetooth 5.1',
      backlighting: 'LIGHTSYNC RGB',
      backlightingColor: 'bg-slate-100 text-slate-700',
      backlightingDot: 'bg-slate-400',
      warranty: '2 Years Limited Hardware Warranty',
    },
    'bestseller-4': {
      name: 'Pro Coiled Aviator Cable',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgdShxLlKCypMs41C4ireig29gMbYTcanzcugGp8t-hCCcH_Bbydd3W8vCLPbdtGLpSXlecsJdUMyEZ-R4i7d56copAT6erQtq1DkZiY77ZFMnlBetA9tX24i75RATOLlC7Agaffx_2fpn0jNJndIDhahEGWK-Imu1QevPVpOZSfabGlFPLjePlxNSS2hp3EGuNRrsoQsDtjEYf_jq9pwnJHYLnQ9yCq8HZLNBS9Ivrh3oJH5kktTCbvODwFUo5iwnmnjxVUCx-0NL',
      rating: 5.0,
      reviews: 56,
      price: '₹1,999',
      stock: 'In Stock',
      stockColor: 'text-green-600',
      switchType: 'USB-C Cable',
      switchDetail: 'Coiled Design',
      connectivity: 'USB-C Wired',
      connectivityDetail: '',
      backlighting: 'N/A',
      backlightingColor: 'bg-slate-100 text-slate-700',
      backlightingDot: 'bg-slate-400',
      warranty: '6 Months Warranty',
    },
  };

  return details[productId] || {
    name: 'Product',
    image: '',
    rating: 4.0,
    reviews: 0,
    price: '₹0',
    stock: 'In Stock',
    stockColor: 'text-green-600',
    switchType: 'N/A',
    switchDetail: '',
    connectivity: 'N/A',
    connectivityDetail: '',
    backlighting: 'N/A',
    backlightingColor: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400',
    backlightingDot: 'bg-slate-400',
    warranty: 'Standard Warranty',
  };
};

export default function CompareTable() {
  const { compareProducts, removeFromCompare } = useCompare();

  if (compareProducts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <p className="text-slate-500">No products selected for comparison.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-6 w-1/4 min-w-[200px] border-b border-slate-100 bg-slate-50/50">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Product Features
                </span>
              </th>
              {compareProducts.map((product) => {
                const details = getProductDetails(product.id);
                return (
                  <th
                    key={product.id}
                    className="p-6 border-b border-slate-100 group relative"
                  >
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                    <div className="flex flex-col items-center gap-4">
                      <img
                        alt={product.name}
                        className="w-48 h-32 object-contain rounded-lg shadow-md"
                        src={details.image || product.image}
                      />
                      <div className="text-center">
                        <h3 className="font-bold text-lg leading-tight">{details.name}</h3>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <StarRating rating={details.rating} />
                          <span className="text-[12px] text-slate-400 ml-1">
                            ({details.reviews})
                          </span>
                        </div>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {/* Price Row */}
            <tr>
              <td className="p-6 font-semibold text-slate-600 bg-slate-50/30">
                Price
              </td>
              {compareProducts.map((product) => {
                const details = getProductDetails(product.id);
                return (
                  <td key={product.id} className="p-6">
                    <div className="text-2xl font-black text-primary">{details.price}</div>
                    <div className={`text-xs font-semibold mt-1 ${details.stockColor}`}>
                      {details.stock}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Switch Type Row */}
            <tr>
              <td className="p-6 font-semibold text-slate-600 bg-slate-50/30">
                Switch Type
              </td>
              {compareProducts.map((product) => {
                const details = getProductDetails(product.id);
                return (
                  <td key={product.id} className="p-6">
                    <div className="font-medium">{details.switchType}</div>
                    {details.switchDetail && (
                      <div className="text-sm text-slate-500">{details.switchDetail}</div>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Connectivity Row */}
            <tr>
              <td className="p-6 font-semibold text-slate-600 bg-slate-50/30">
                Connectivity
              </td>
              {compareProducts.map((product) => {
                const details = getProductDetails(product.id);
                return (
                  <td key={product.id} className="p-6">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400">
                        {details.connectivity.includes('Wireless') ? 'wifi' : 'usb'}
                      </span>
                      <span>{details.connectivity}</span>
                    </div>
                    {details.connectivityDetail && (
                      <div className="text-sm text-slate-500 mt-1">{details.connectivityDetail}</div>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Backlighting Row */}
            <tr>
              <td className="p-6 font-semibold text-slate-600 bg-slate-50/30">
                Backlighting
              </td>
              {compareProducts.map((product) => {
                const details = getProductDetails(product.id);
                return (
                  <td key={product.id} className="p-6">
                    <div
                      className={`inline-flex items-center gap-2 px-2.5 py-1 ${details.backlightingColor} text-xs font-bold rounded-full`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${details.backlightingDot} ${
                          details.backlighting.includes('RGB') ? 'animate-pulse' : ''
                        }`}
                      ></span>
                      {details.backlighting}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Warranty Row */}
            <tr>
              <td className="p-6 font-semibold text-slate-600 bg-slate-50/30">
                Warranty
              </td>
              {compareProducts.map((product) => {
                const details = getProductDetails(product.id);
                return (
                  <td key={product.id} className="p-6 text-sm">
                    {details.warranty}
                  </td>
                );
              })}
            </tr>

            {/* Actions Row */}
            <tr className="bg-slate-50/50">
              <td className="p-6"></td>
              {compareProducts.map((product) => (
                <td key={product.id} className="p-6">
                  <button className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    Buy Now
                    <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                  </button>
                  <button className="w-full mt-3 text-sm font-semibold text-primary hover:underline">
                    Add to Wishlist
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

