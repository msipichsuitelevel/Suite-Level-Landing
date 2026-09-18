import { LogoDefs, Logo } from '@/components/Logo';
import { APP_URL } from '@/lib/site';

/**
 * Shell for the Privacy Policy and Terms pages: the mark, a way back, and one
 * narrow measure on the same canvas as the landing page. No rail, because
 * these pages have nothing to index.
 */
export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="plain">
      <LogoDefs />
      <div className="col legal">
        <a className="back" href="/">
          <span aria-hidden="true">&larr;</span> Suite Level
        </a>
        <Logo className="logo" width={180} height={32} />
        <h1>{title}</h1>
        <p className="updated">Last updated: {lastUpdated}</p>
        {children}
        <div className="foot">
          <span>&copy; {new Date().getFullYear()} Suite Level, Inc.</span>
          <nav>
            <a href="/">Home</a>
            <a href="/privacy-policy/">Privacy Policy</a>
            <a href={`${APP_URL}/terms-of-service`}>Terms of Service</a>
          </nav>
        </div>
      </div>
    </div>
  );
}
