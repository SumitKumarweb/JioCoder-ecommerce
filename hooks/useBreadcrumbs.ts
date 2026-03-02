import { usePathname } from 'next/navigation';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();

  // Default breadcrumb for home
  if (pathname === '/') {
    return [{ label: 'Home' }];
  }

  // Split pathname into segments
  const segments = pathname.split('/').filter(Boolean);
  
  // Build breadcrumb items
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
  ];

  // Add each segment as a breadcrumb
  segments.forEach((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;
    
    // Capitalize and format segment name
    const label = segment
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

