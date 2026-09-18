import type { Metadata } from 'next';

import { LogoDefs, Logo } from '@/components/Logo';

export const metadata: Metadata = {
  title: 'Page not found',
  // A 404 must never be indexed, whatever the rest of the site says.
  robots: { index: false, follow: false },
};

/**
 * Exported as `404.html`. IIS serves it through the `httpErrors` entry in
 * `web.config`; without that entry IIS shows its own default error page
 * instead, so the two have to stay in step.
 */
export default function NotFound() {
  return (
    <div className="plain">
      <LogoDefs />
      <div className="col legal">
        <Logo className="logo" width={180} height={32} />
        <h1>That page isn&rsquo;t here.</h1>
        <p>
          The link may be out of date, or the page may have moved. Everything about Suite Level is
          on the <a href="/">home page</a>.
        </p>
        <p>
          <a className="btn" href="/#join" style={{ marginTop: 18 }}>
            Request access
          </a>
        </p>
      </div>
    </div>
  );
}
