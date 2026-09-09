import { useEffect, useState } from 'react';

/**
 * React hook that tracks whether a CSS media query matches.
 * Defaults to `(min-width: 1024px)` — the Tailwind `lg` breakpoint.
 */
export function useMediaQuery(query = '(min-width: 1024px)'): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Set initial state (covers SSR hydration mismatch)
    setMatches(mql.matches);

    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
