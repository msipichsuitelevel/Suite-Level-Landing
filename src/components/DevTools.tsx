'use client';

import { useEffect } from 'react';

/**
 * Development-only tooling. Mirrors what the Suite Level client does in its
 * index.html, where the same package is loaded behind Vite's `import.meta.env.DEV`.
 *
 * react-grab lets you pick an element on the page and hand it to a coding agent.
 * It is a devDependency and must never reach the exported site: the export is
 * served as plain files from IIS, so anything that lands in `out/` is public.
 *
 * Two guards, because this ships to production as static files and a runtime-only
 * check would still leave the chunk in `out/`:
 *   - layout.tsx only renders this component when NODE_ENV is development, and
 *   - the dynamic import sits inside a NODE_ENV branch here.
 * Next inlines NODE_ENV at build time, so in a production build both fold to
 * `false` and the import is dropped rather than merely skipped.
 */
export function DevTools() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Swallow the failure: a missing dev tool must never break the page.
      import('@gusb.dev/react-grab').catch(() => {});
    }
  }, []);

  return null;
}
