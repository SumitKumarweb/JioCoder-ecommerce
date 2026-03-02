'use client';

export type SortOption = 'popularity' | 'price-low' | 'price-high' | 'newest' | 'discount';

interface ProductSortProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'discount', label: 'Discount %' },
];

export default function ProductSort({ sortBy, onSortChange }: ProductSortProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-bold text-slate-400 whitespace-nowrap">SORT BY</span>
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold focus:ring-primary/20 focus:border-primary outline-none cursor-pointer min-w-[180px]"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          expand_more
        </span>
      </div>
    </div>
  );
}

