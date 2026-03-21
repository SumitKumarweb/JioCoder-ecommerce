'use client';

import { useState, useCallback } from 'react';

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  priceRange: [number, number];
  brands: string[];
  minRating: number;
  inStockOnly: boolean;
}

const BRANDS = [
  { name: 'Logitech', count: 42 },
  { name: 'Keychron', count: 28 },
  { name: 'Razer', count: 15 },
  { name: 'Zebronics', count: 56 },
  { name: 'TVS Gold', count: 4 },
];

const RATING_OPTIONS = [5, 4, 3, 2];

const MIN_PRICE = 500;
const MAX_PRICE = 50000;

function StarRow({ filled, total = 5 }: { filled: number; total?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="material-symbols-outlined text-[18px] leading-none"
          style={{
            color: i < filled ? '#f59e0b' : '#cbd5e1',
            fontVariationSettings: i < filled ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          star
        </span>
      ))}
    </div>
  );
}

// Section wrapper — defined outside the main component so React never unmounts/remounts children
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{title}</h3>
      {children}
    </div>
  );
}

// Dual-thumb range slider
function DualRangeSlider({
  min,
  max,
  step,
  valueMin,
  valueMax,
  onChange,
}: {
  min: number;
  max: number;
  step: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
}) {
  const percent = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <div className="relative pt-1 pb-3 px-1">
      {/* Track background */}
      <div className="relative h-1.5 w-full bg-slate-200 rounded-full">
        {/* Active fill */}
        <div
          className="absolute h-full bg-primary rounded-full"
          style={{ left: `${percent(valueMin)}%`, right: `${100 - percent(valueMax)}%` }}
        />
      </div>

      {/* Min thumb */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={valueMin}
        onChange={(e) => {
          const v = Math.min(Number(e.target.value), valueMax - step);
          onChange(v, valueMax);
        }}
        className="absolute inset-0 w-full h-1.5 opacity-0 cursor-pointer"
        style={{ zIndex: valueMin > max - step ? 5 : 3 }}
      />

      {/* Max thumb */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={valueMax}
        onChange={(e) => {
          const v = Math.max(Number(e.target.value), valueMin + step);
          onChange(valueMin, v);
        }}
        className="absolute inset-0 w-full h-1.5 opacity-0 cursor-pointer"
        style={{ zIndex: 4 }}
      />

      {/* Thumb indicators */}
      <div
        className="absolute top-0 w-4 h-4 -mt-[5px] bg-white border-2 border-primary rounded-full shadow-md pointer-events-none"
        style={{ left: `calc(${percent(valueMin)}% - 8px)` }}
      />
      <div
        className="absolute top-0 w-4 h-4 -mt-[5px] bg-white border-2 border-primary rounded-full shadow-md pointer-events-none"
        style={{ left: `calc(${percent(valueMax)}% - 8px)` }}
      />
    </div>
  );
}

export default function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([MIN_PRICE, MAX_PRICE]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const emit = useCallback(
    (overrides: Partial<FilterState>) => {
      onFilterChange({
        priceRange,
        brands: selectedBrands,
        minRating,
        inStockOnly,
        ...overrides,
      });
    },
    [priceRange, selectedBrands, minRating, inStockOnly, onFilterChange]
  );

  const handlePriceChange = (lo: number, hi: number) => {
    const next: [number, number] = [lo, hi];
    setPriceRange(next);
    emit({ priceRange: next });
  };

  const handleBrandToggle = (brand: string) => {
    const next = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(next);
    emit({ brands: next });
  };

  const handleRatingClick = (rating: number) => {
    const next = minRating === rating ? 0 : rating;
    setMinRating(next);
    emit({ minRating: next });
  };

  const handleStockToggle = () => {
    const next = !inStockOnly;
    setInStockOnly(next);
    emit({ inStockOnly: next });
  };

  const clearAllFilters = () => {
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setSelectedBrands([]);
    setMinRating(0);
    setInStockOnly(false);
    onFilterChange({ priceRange: [MIN_PRICE, MAX_PRICE], brands: [], minRating: 0, inStockOnly: false });
  };

  const activeCount =
    (priceRange[0] !== MIN_PRICE || priceRange[1] !== MAX_PRICE ? 1 : 0) +
    selectedBrands.length +
    (minRating > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-slate-600">tune</span>
          <span className="font-bold text-slate-800 text-sm">Filters</span>
          {activeCount > 0 && (
            <span className="bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-primary font-semibold hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Price Range */}
      <Section title="Price Range">
        <DualRangeSlider
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={500}
          valueMin={priceRange[0]}
          valueMax={priceRange[1]}
          onChange={handlePriceChange}
        />
        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-center">
            <p className="text-[10px] text-slate-400 font-medium">Min</p>
            <p className="text-sm font-bold text-slate-800">₹{priceRange[0].toLocaleString('en-IN')}</p>
          </div>
          <div className="w-4 h-0.5 bg-slate-200 flex-shrink-0" />
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-center">
            <p className="text-[10px] text-slate-400 font-medium">Max</p>
            <p className="text-sm font-bold text-slate-800">
              ₹{priceRange[1].toLocaleString('en-IN')}{priceRange[1] === MAX_PRICE ? '+' : ''}
            </p>
          </div>
        </div>
      </Section>

      {/* Brand */}
      <Section title="Brand">
        <div className="space-y-2.5">
          {BRANDS.map((brand) => {
            const checked = selectedBrands.includes(brand.name);
            return (
              <label
                key={brand.name}
                className={`flex items-center gap-3 cursor-pointer rounded-lg px-2 py-1.5 transition-colors ${
                  checked ? 'bg-primary/5' : 'hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-colors ${
                    checked ? 'bg-primary border-primary' : 'border-slate-300'
                  }`}
                  onClick={() => handleBrandToggle(brand.name)}
                >
                  {checked && (
                    <span
                      className="material-symbols-outlined text-white text-[13px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check
                    </span>
                  )}
                </div>
                <input type="checkbox" className="hidden" checked={checked} onChange={() => handleBrandToggle(brand.name)} />
                <span className={`text-sm font-medium flex-1 transition-colors ${checked ? 'text-primary' : 'text-slate-700'}`}>
                  {brand.name}
                </span>
                <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">{brand.count}</span>
              </label>
            );
          })}
        </div>
      </Section>

      {/* Rating */}
      <Section title="Min Rating">
        <div className="space-y-1.5">
          {RATING_OPTIONS.map((rating) => {
            const active = minRating === rating;
            return (
              <button
                key={rating}
                onClick={() => handleRatingClick(rating)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary/10 text-primary ring-1 ring-primary/30'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <StarRow filled={rating} />
                  <span className="text-xs">& Up</span>
                </div>
                {active && (
                  <span
                    className="material-symbols-outlined text-primary text-base"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Availability */}
      <Section title="Availability">
        <label
          className={`flex items-center gap-3 cursor-pointer rounded-lg px-2 py-2 transition-colors ${
            inStockOnly ? 'bg-primary/5' : 'hover:bg-slate-50'
          }`}
        >
          <div
            className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-colors ${
              inStockOnly ? 'bg-primary border-primary' : 'border-slate-300'
            }`}
            onClick={handleStockToggle}
          >
            {inStockOnly && (
              <span
                className="material-symbols-outlined text-white text-[13px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check
              </span>
            )}
          </div>
          <input type="checkbox" className="hidden" checked={inStockOnly} onChange={handleStockToggle} />
          <div>
            <span className={`text-sm font-medium block ${inStockOnly ? 'text-primary' : 'text-slate-700'}`}>
              In Stock Only
            </span>
            <span className="text-xs text-slate-400">Ships immediately</span>
          </div>
          {inStockOnly && (
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
              ON
            </span>
          )}
        </label>
      </Section>

      {/* Clear Filters — only when active */}
      {activeCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-700 text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-base">filter_list_off</span>
          Clear All Filters ({activeCount})
        </button>
      )}
    </aside>
  );
}
