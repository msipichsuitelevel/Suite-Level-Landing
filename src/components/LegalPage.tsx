import { LogoDefs, Logo } from '@/components/Logo';

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
        <div className="legal-head">
          <a className="back" href="/">
            <span aria-hidden="true">&larr;</span> Back to Suite Level
          </a>
          <a href="/" aria-label="Suite Level, home">
            <Logo className="logo" width={180} height={32} />
          </a>
        </div>
        <h1>{title}</h1>
        <p className="updated">Last updated: {lastUpdated}</p>
        {children}
        <div className="foot">
          <span>&copy; {new Date().getFullYear()} Suite Level, Inc.</span>
          <nav>
            <a href="/">Home</a>
            <a href="/privacy-policy/">Privacy Policy</a>
          </nav>
        </div>
      </div>
    </div>
  );
}
