'use client';

import { ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface LazySectionProps {
  children: ReactNode;
  skeleton: ReactNode;
  className?: string;
}

export default function LazySection({ children, skeleton, className = '' }: LazySectionProps) {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true,
  });

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : skeleton}
    </div>
  );
}

