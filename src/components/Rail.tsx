'use client';

import { useEffect, useState } from 'react';

import { Logo } from '@/components/Logo';
import { APP_URL, SECTIONS } from '@/lib/site';

const OFFSET = 120; // where the page "reads from" when deciding the current section

/**
 * The persistent left rail: mark, section index, call to action. It never
 * scrolls away, so the ask is always one click off.
 *
 * It also owns the page's bottom fade, because both are driven by the same
 * scroll position and splitting them would mean two scroll listeners.
 */
export function Rail() {
  const [current, setCurrent] = useState<string | null>(null);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    let queued = false;

    const sync = () => {
      queued = false;
      // The last section whose top edge has passed the reading line wins, so
      // the index follows the reader rather than the nearest heading.
      let found: string | null = null;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top - OFFSET <= 0) found = section.id;
      }
      setCurrent(found);
      setAtBottom(
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24,
      );
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(sync);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', sync);
    sync();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', sync);
    };
  }, []);

  return (
    <>
      <aside className="rail">
        <div className="rail-brand">
          <a href="#top" aria-label="Suite Level, home">
            <Logo className="logo" />
          </a>
        </div>

        <nav className="rail-index" aria-label="Sections">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={current === section.id ? 'is-active' : undefined}
              aria-current={current === section.id ? 'true' : undefined}
              onClick={() => setCurrent(section.id)}
            >
              {section.label}
            </a>
          ))}
        </nav>

        <div className="rail-cta">
          <a className="btn btn-block" href="#join">
            Join the waitlist
          </a>
          <a className="rail-signin" href={`${APP_URL}/auth`}>
            Already have an account? Sign in
          </a>
        </div>
      </aside>

      <div className={`page-fade${atBottom ? ' is-off' : ''}`} aria-hidden="true" />
    </>
  );
}
