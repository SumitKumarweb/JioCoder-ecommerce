'use client';

import { useState } from 'react';
import Breadcrumb, { BreadcrumbItem } from './Breadcrumb';

interface CompareHeaderProps {
  title?: string;
  description?: string;
  breadcrumbItems?: BreadcrumbItem[];
}

export default function CompareHeader({
  title = 'Compare Mechanical Keyboards',
  description = 'Hand-picked premium selections for your Indian setup.',
  breadcrumbItems,
}: CompareHeaderProps) {
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  // Default breadcrumb items if not provided
  const defaultBreadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Keyboards', href: '/keyboards' },
    { label: 'Comparison' },
  ];

  return (
    <div className="mb-8">
      <Breadcrumb items={breadcrumbItems || defaultBreadcrumbItems} />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-2">{title}</h2>
          <p className="text-slate-500">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600">
            Highlight differences
          </span>
          <button
            onClick={() => setHighlightDifferences(!highlightDifferences)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              highlightDifferences ? 'bg-primary' : 'bg-zinc-500'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                highlightDifferences ? 'translate-x-6' : 'translate-x-1'
              }`}
            ></span>
          </button>
        </div>
      </div>
    </div>
  );
}

