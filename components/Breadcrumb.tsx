'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  autoGenerate?: boolean;
  collectionName?: string;
  productName?: string;
}

// Route to collection name mapping
const routeToCollectionName: Record<string, string> = {
  products: 'Products',
  computing: 'Computing',
  keyboards: 'Keyboards',
  mice: 'Mice',
  accessories: 'Accessories',
  gaming: 'Gaming',
  compare: 'Compare',
};

export default function Breadcrumb({ items, autoGenerate = false, collectionName, productName }: BreadcrumbProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if enabled
  const breadcrumbItems: BreadcrumbItem[] = items || (autoGenerate ? generateBreadcrumbs(pathname, collectionName, productName) : []);

  function generateBreadcrumbs(path: string, collectionName?: string, productName?: string): BreadcrumbItem[] {
    if (path === '/') {
      return [{ label: 'Home' }];
    }

    const segments = path.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

    // Handle product detail pages: /product/[id]
    if (segments[0] === 'product' && segments.length === 2) {
      // Home > Collection Name > Product Name
      if (collectionName) {
        items.push({ label: collectionName, href: '/products' });
      } else {
        items.push({ label: 'Products', href: '/products' });
      }
      
      if (productName) {
        items.push({ label: productName });
      } else {
        // Fallback to formatted product ID
        const productId = segments[1];
        const formattedName = productId
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        items.push({ label: formattedName });
      }
      return items;
    }

    // Handle other routes
    segments.forEach((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      const isLast = index === segments.length - 1;
      
      // Use collection name mapping or format segment name
      const label = routeToCollectionName[segment] || 
        segment
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

      items.push({
        label,
        href: isLast ? undefined : href,
      });
    });

    return items;
  }

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <span className="material-symbols-outlined text-sm text-slate-400">
              chevron_right
            </span>
          )}
          {item.href ? (
            <Link
              className="hover:text-primary transition-colors"
              href={item.href}
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-primary font-bold">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

