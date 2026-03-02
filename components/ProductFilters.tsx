'use client';

import { useState } from 'react';

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  priceRange: [number, number];
  brands: string[];
  minRating: number;
  inStockOnly: boolean;
}

const brands = [
  { name: 'Logitech', count: 42 },
  { name: 'Keychron', count: 28 },
  { name: 'Razer', count: 15 },
  { name: 'Zebronics', count: 56 },
  { name: 'TVS Gold', count: 4 },
];

export default function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 50000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['Logitech']);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const handlePriceChange = (value: number) => {
    const newRange: [number, number] = [500, value];
    setPriceRange(newRange);
    updateFilters({ priceRange: newRange, brands: selectedBrands, minRating, inStockOnly });
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(newBrands);
    updateFilters({ priceRange, brands: newBrands, minRating, inStockOnly });
  };

  const handleRatingClick = (rating: number) => {
    const newRating = minRating === rating ? 0 : rating;
    setMinRating(newRating);
    updateFilters({ priceRange, brands: selectedBrands, minRating: newRating, inStockOnly });
  };

  const handleStockToggle = () => {
    const newStock = !inStockOnly;
    setInStockOnly(newStock);
    updateFilters({ priceRange, brands: selectedBrands, minRating, inStockOnly: newStock });
  };

  const updateFilters = (filters: FilterState) => {
    onFilterChange(filters);
  };

  const clearAllFilters = () => {
    setPriceRange([500, 50000]);
    setSelectedBrands([]);
    setMinRating(0);
    setInStockOnly(false);
    updateFilters({ priceRange: [500, 50000], brands: [], minRating: 0, inStockOnly: false });
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24 space-y-6 sm:space-y-8">
      {/* Price Range */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          Price Range
        </h3>
        <div className="px-2">
          <input
            className="w-full accent-primary h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            max={50000}
            min={500}
            step={500}
            type="range"
            value={priceRange[1]}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
          />
          <div className="flex justify-between mt-3 text-sm font-semibold">
            <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
            <span>₹{priceRange[1].toLocaleString('en-IN')}+</span>
          </div>
        </div>
      </div>

      {/* Brand */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          Brand
        </h3>
        <div className="space-y-3">
          {brands.map((brand) => (
            <label key={brand.name} className="flex items-center gap-3 cursor-pointer group">
              <input
                checked={selectedBrands.includes(brand.name)}
                className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 transition-all"
                type="checkbox"
                onChange={() => handleBrandToggle(brand.name)}
              />
              <span className="text-sm font-medium group-hover:text-primary transition-colors">
                {brand.name} <span className="text-slate-400 ml-1">({brand.count})</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          Rating
        </h3>
        <div className="space-y-3">
          <button
            onClick={() => handleRatingClick(4)}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              minRating === 4 ? 'text-primary' : 'hover:text-primary'
            }`}
          >
            <div className="flex text-yellow-400">
              <span className="material-symbols-outlined text-lg fill-1">star</span>
              <span className="material-symbols-outlined text-lg fill-1">star</span>
              <span className="material-symbols-outlined text-lg fill-1">star</span>
              <span className="material-symbols-outlined text-lg fill-1">star</span>
              <span className="material-symbols-outlined text-lg">star</span>
            </div>
            <span>& Up</span>
          </button>
          <button
            onClick={() => handleRatingClick(3)}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              minRating === 3 ? 'text-primary' : 'hover:text-primary'
            }`}
          >
            <div className="flex text-yellow-400">
              <span className="material-symbols-outlined text-lg fill-1">star</span>
              <span className="material-symbols-outlined text-lg fill-1">star</span>
              <span className="material-symbols-outlined text-lg fill-1">star</span>
              <span className="material-symbols-outlined text-lg">star</span>
              <span className="material-symbols-outlined text-lg">star</span>
            </div>
            <span>& Up</span>
          </button>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          Availability
        </h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            checked={inStockOnly}
            className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 transition-all"
            type="checkbox"
            onChange={handleStockToggle}
          />
          <span className="text-sm font-medium group-hover:text-primary transition-colors">
            In Stock Only
          </span>
        </label>
      </div>

      {/* Clear Filters */}
      <div className="pt-6 border-t border-slate-200">
        <button
          onClick={clearAllFilters}
          className="w-full py-2.5 px-4 bg-primary/5 hover:bg-primary/10 text-primary font-bold rounded-xl transition-all text-sm"
        >
          Clear All Filters
        </button>
      </div>
    </aside>
  );
}

