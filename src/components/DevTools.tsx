'use client';

import { useEffect } from 'react';

/**
 * Development-only tooling. Mirrors what the Suite Level client does in its
 * index.html, where the same package is loaded behind Vite's `import.meta.env.DEV`.
 *
 * react-grab lets you pick an element on the page and hand it to a coding agent.
 * It must never reach the exported site: the export is served as plain files
 * from IIS, so anything that lands in `out/` is public.
 *
 * The NODE_ENV check below is the only guard, and it is enough. Next inlines
 * NODE_ENV at build time, so a production build folds it to `false` and drops
 * the import rather than merely skipping it - verified by grepping `out/` for
 * react-grab after a clean build. The component is therefore mounted
 * unconditionally in layout.tsx, matching the checaturno landing this is copied
 * from.
 *
 * Note for anyone putting a breakpoint here: this runs once, on mount. Chrome
 * ignores `debugger` when DevTools is closed, so open DevTools FIRST and then
 * reload - opening it afterwards is too late, the effect has already run.
 */
export function DevTools() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Swallowed: a missing dev tool must never break the page.
      import('@gusb.dev/react-grab').catch(() => {});
    }
  }, []);

  return null;
}
