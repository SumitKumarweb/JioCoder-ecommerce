'use client';

import ProductCard from './ProductCard';

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: {
    text: string;
    color: 'red' | 'green' | 'primary';
  };
  discount?: number;
  brand: string;
  inStock: boolean;
}

interface ProductGridProps {
  products: Product[];
  collectionSlug?: string;
}

export default function ProductGrid({ products, collectionSlug }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
          search_off
        </span>
        <h3 className="text-xl font-bold text-slate-700 mb-2">No products found</h3>
        <p className="text-slate-500">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          image={product.image}
          price={product.price}
          originalPrice={product.originalPrice}
          rating={product.rating}
          reviewCount={product.reviewCount}
          badge={product.badge}
          discount={product.discount}
          collectionSlug={collectionSlug}
        />
      ))}
    </div>
  );
}

