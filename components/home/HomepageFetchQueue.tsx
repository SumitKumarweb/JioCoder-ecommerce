"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

type Enqueue = (fn: () => Promise<void>) => void;

const HomepageFetchQueueContext = createContext<Enqueue | null>(null);

/**
 * Serializes homepage section fetches in registration order (matches DOM top-to-bottom)
 * so APIs are not all fired at once on first paint.
 */
export function HomepageFetchQueueProvider({ children }: { children: ReactNode }) {
  const tailRef = useRef(Promise.resolve());

  const enqueue = useCallback((fn: () => Promise<void>) => {
    tailRef.current = tailRef.current.then(fn).catch(() => {});
  }, []);

  const value = useMemo(() => enqueue, [enqueue]);

  return (
    <HomepageFetchQueueContext.Provider value={value}>
      {children}
    </HomepageFetchQueueContext.Provider>
  );
}

export function useHomepageFetchQueue(): Enqueue {
  const ctx = useContext(HomepageFetchQueueContext);
  if (!ctx) {
    return (fn) => {
      void fn().catch(() => {});
    };
  }
  return ctx;
}
