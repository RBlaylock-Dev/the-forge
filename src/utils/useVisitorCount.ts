'use client';

import { useEffect } from 'react';
import { useForgeStore } from '@/store/useForgeStore';

const SESSION_KEY = 'forge-visitor-counted';

/**
 * Fetches and optionally increments the visitor counter.
 * Uses sessionStorage to ensure each browser session is only counted once.
 */
export function useVisitorCount() {
  const setVisitorCount = useForgeStore((s) => s.setVisitorCount);

  useEffect(() => {
    const alreadyCounted = sessionStorage.getItem(SESSION_KEY);

    if (alreadyCounted) {
      // Already counted this session — just fetch current count
      fetch('/api/visitors')
        .then((res) => res.json())
        .then((data) => {
          if (data.count > 0) setVisitorCount(data.count);
        })
        .catch(() => {});
    } else {
      // New session — increment and store
      fetch('/api/visitors', { method: 'POST' })
        .then((res) => res.json())
        .then((data) => {
          if (data.count > 0) setVisitorCount(data.count);
          sessionStorage.setItem(SESSION_KEY, '1');
        })
        .catch(() => {});
    }
  }, [setVisitorCount]);
}
