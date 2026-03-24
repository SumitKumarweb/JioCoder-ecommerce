"use client";

import { useCallback, useEffect, useState } from "react";

type Options = {
  /** Extra viewport margin so fetch starts slightly before the section is visible */
  rootMargin?: string;
  /** Skip observer — fetch on mount (use for above-the-fold hero) */
  immediate?: boolean;
};

/**
 * Fires once when the observed element intersects the viewport (or immediately if `immediate`).
 */
export function useInViewOnce(options: Options = {}) {
  const { rootMargin = "160px 0px 240px 0px", immediate = false } = options;
  const [shouldLoad, setShouldLoad] = useState(immediate);
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  const wrapperRef = useCallback((el: HTMLDivElement | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    if (immediate || shouldLoad || !node) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
        }
      },
      { root: null, rootMargin, threshold: 0 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [node, immediate, shouldLoad, rootMargin]);

  return { wrapperRef, shouldLoad };
}
