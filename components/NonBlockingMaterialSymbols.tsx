'use client';

import { useEffect } from 'react';

const MATERIAL_SYMBOLS_URL =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';

/**
 * Injects the Material Symbols stylesheet after hydration so it never
 * blocks the initial render / LCP measurement.
 */
export default function NonBlockingMaterialSymbols() {
  useEffect(() => {
    if (document.querySelector(`link[href="${MATERIAL_SYMBOLS_URL}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = MATERIAL_SYMBOLS_URL;
    document.head.appendChild(link);
  }, []);

  return null;
}
