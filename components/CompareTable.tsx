'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCompare } from '@/contexts/CompareContext';
import { useCart } from '@/contexts/CartContext';

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

interface ProductDetails {
  name: string;
  image: string;
  rating: number;
  reviews: number;
  price: string;
  stock: string;
  stockColor: string;
  switchType: string;
  switchDetail: string;
  connectivity: string;
  connectivityDetail: string;
  backlighting: string;
  backlightingColor: string;
  backlightingDot: string;
  warranty: string;
}

export default function CompareTable() {
  const router = useRouter();
  const { compareProducts, removeFromCompare } = useCompare();
  const { buyNow } = useCart();
  const [detailsMap, setDetailsMap] = React.useState<Record<string, ProductDetails>>({});

  React.useEffect(() => {
    const loadDetails = async () => {
      if (compareProducts.length === 0) return;
      try {
        const res = await fetch('/api/products');
        if (!res.ok) return;
        const data: any[] = await res.json();

        const map: Record<string, ProductDetails> = {};
        data.forEach((p) => {
          map[p._id] = {
            name: p.name,
            image: p.image,
            rating: p.rating ?? 4.5,
            reviews: p.reviewCount ?? 0,
            price: `₹${(p.price ?? 0).toLocaleString('en-IN')}`,
            stock: p.inStock ? 'In Stock' : 'Out of Stock',
            stockColor: p.inStock ? 'text-green-600' : 'text-red-500',
            switchType: p.switchType || 'N/A',
            switchDetail: '',
            connectivity: p.connectivity || 'N/A',
            connectivityDetail: '',
            backlighting: p.backlighting || 'N/A',
            backlightingColor: 'bg-slate-100 text-slate-700',
            backlightingDot: 'bg-slate-400',
            warranty: p.warranty || 'Standard Warranty',
          };
        });

        setDetailsMap(map);
      } catch (error) {
        console.error('Failed to load compare details', error);
      }
    };

    void loadDetails();
  }, [compareProducts]);

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
                const details = detailsMap[product.id] as ProductDetails | undefined;
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
                      {details && (
                        <img
                          alt={product.name}
                          className="w-48 h-32 object-contain rounded-lg shadow-md"
                          src={details.image || product.image}
                        />
                      )}
                      <div className="text-center">
                        <h3 className="font-bold text-lg leading-tight">
                          {details?.name || product.name}
                        </h3>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          {details && (
                            <>
                              <StarRating rating={details.rating} />
                              <span className="text-[12px] text-slate-400 ml-1">
                                ({details.reviews})
                              </span>
                            </>
                          )}
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
                const details = detailsMap[product.id];
                return (
                  <td key={product.id} className="p-6">
                    {details && (
                      <>
                        <div className="text-2xl font-black text-primary">{details.price}</div>
                        <div className={`text-xs font-semibold mt-1 ${details.stockColor}`}>
                          {details.stock}
                        </div>
                      </>
                    )}
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
                const details = detailsMap[product.id];
                return (
                  <td key={product.id} className="p-6">
                    <div className="font-medium">{details?.switchType || 'N/A'}</div>
                    {details?.switchDetail && (
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
                const details = detailsMap[product.id];
                return (
                  <td key={product.id} className="p-6">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400">
                        {details && typeof details.connectivity === 'string' && details.connectivity.includes('Wireless')
                          ? 'wifi'
                          : 'usb'}
                      </span>
                      <span>{details?.connectivity || 'N/A'}</span>
                    </div>
                    {details?.connectivityDetail && (
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
                const details = detailsMap[product.id];
                return (
                  <td key={product.id} className="p-6">
                    {details && (
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
                    )}
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
                const details = detailsMap[product.id];
                return (
                  <td key={product.id} className="p-6 text-sm">
                    {details?.warranty || 'Standard Warranty'}
                  </td>
                );
              })}
            </tr>

            {/* Actions Row */}
            <tr className="bg-slate-50/50">
              <td className="p-6"></td>
              {compareProducts.map((product) => {
                const details = detailsMap[product.id];
                const numericPrice =
                  details && typeof details.price === 'string'
                    ? parseInt(details.price.replace(/[₹,]/g, ''), 10) || 0
                    : typeof product.price === 'number'
                    ? product.price
                    : 0;
                return (
                  <td key={product.id} className="p-6">
                    <button
                      onClick={() => {
                        const safeDetails = details || {
                          name: product.name,
                          image: product.image,
                        } as ProductDetails;
                        buyNow({
                          id: product.id,
                          name: safeDetails.name,
                          image: safeDetails.image,
                          price: numericPrice,
                        });
                        router.push('/checkout');
                      }}
                      className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    >
                      Buy Now
                      <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                    </button>
                    <button className="w-full mt-3 text-sm font-semibold text-primary hover:underline">
                      Add to Wishlist
                    </button>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

