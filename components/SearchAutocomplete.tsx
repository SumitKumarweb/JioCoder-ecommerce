'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  name: string;
  image?: string;
  price: number;
  category?: string;
}

interface SearchAutocompleteProps {
  query: string;
  onSelect?: () => void;
}

export default function SearchAutocomplete({ query, onSelect }: SearchAutocompleteProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const router = useRouter();

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Don't search if query is too short
    if (query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    // Debounce search
    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}&limit=5`);
        if (!res.ok) {
          throw new Error('Search failed');
        }
        const data: { results: SearchResult[] } = await res.json();
        setResults(data.results || []);
        setShowResults(true);
      } catch (error) {
        console.error('Search autocomplete error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  const handleSelect = (productId: string) => {
    setShowResults(false);
    router.push(`/product/${productId}`);
    onSelect?.();
  };

  if (!showResults || results.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 w-full mt-2 bg-white text-slate-900 shadow-2xl rounded-xl border border-slate-100 overflow-hidden z-50">
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-slate-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm">Searching...</p>
          </div>
        ) : (
          <>
            <div className="p-2">
              <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-widest px-3 py-2">
                Search Results
              </h4>
              <div className="space-y-1">
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelect(product.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left group"
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded border border-slate-200"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-900 group-hover:text-primary transition-colors truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-primary">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.category && (
                          <span className="text-xs text-slate-500">• {product.category}</span>
                        )}
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                      arrow_forward
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-100 p-2">
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => setShowResults(false)}
                className="block w-full text-center py-2 text-sm font-semibold text-primary hover:bg-slate-50 rounded-lg transition-colors"
              >
                View all results →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

