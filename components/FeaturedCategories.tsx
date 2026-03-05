'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FeaturedCategory {
  _id: string;
  name: string;
  image: string;
  url: string;
}

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<FeaturedCategory[]>([]);
  const [viewAllUrl, setViewAllUrl] = useState('/products');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/featured-categories');
        if (!res.ok) {
          throw new Error(`Failed to fetch featured categories: ${res.status}`);
        }
        const data: FeaturedCategory[] = await res.json();
        setCategories(data || []);
        // Keep default view-all URL for now; can be made configurable later
        setViewAllUrl('/products');
      } catch (error) {
        console.error('Failed to load featured categories from API', error);
      }
    };

    loadCategories();
  }, []);

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">
          Featured Categories
        </h3>
        <Link
          href={viewAllUrl}
          className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline"
        >
          View All
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={category.url}
            className="group text-center space-y-3"
          >
            <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 p-4 transition-all group-hover:shadow-md group-hover:border-primary/20">
              <img
                alt={category.name}
                className="w-full rounded-xl h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform"
                src={category.image}
              />
            </div>
            <p className="font-semibold text-sm lg:text-base group-hover:text-primary transition-colors">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

