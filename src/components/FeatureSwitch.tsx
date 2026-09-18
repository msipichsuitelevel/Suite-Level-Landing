'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { FEATURES } from '@/lib/content';

const GAP = 180; // ms of quiet that ends one wheel gesture
const THRESHOLD = 40; // px of scroll needed to count as a step

/**
 * The Platform section: a sidebar of feature tabs beside one screenshot frame.
 *
 * Ported from the design artifact, which drove this by mutating the DOM. Here
 * the selected tab and each tab's current screenshot are React state, so the
 * scroll indicator is derived rather than recomputed by a MutationObserver.
 *
 * Browsing by scroll is deliberately opt-in: it only engages after a click
 * inside the frame, so a reader scrolling the page past this section is never
 * trapped by it.
 */
export function FeatureSwitch() {
  const [active, setActive] = useState(0);
  // One current-screenshot index per feature, so switching away from a tab and
  // back returns to the screenshot that was showing.
  const [slides, setSlides] = useState<number[]>(() => FEATURES.map(() => 0));
  const [armed, setArmed] = useState(false);

  const frameRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const setSlide = useCallback((feature: number, index: number) => {
    setSlides((prev) => {
      const count = FEATURES[feature].shots.length;
      const clamped = Math.max(0, Math.min(count - 1, index));
      if (prev[feature] === clamped) return prev;
      const next = prev.slice();
      next[feature] = clamped;
      return next;
    });
  }, []);

  /* ---- arming: click inside to browse by scroll, Esc or scrolling away to stop ---- */
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const frame = frameRef.current;
      setArmed(!!frame && frame.contains(e.target as Node));
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setArmed(false);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);

    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== 'undefined' && frameRef.current) {
      observer = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) setArmed(false);
      });
      observer.observe(frameRef.current);
    }
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
      observer?.disconnect();
    };
  }, []);

  /* ---- scroll-to-browse ----
     The gesture bookkeeping lives in refs, not state: it changes many times per
     flick and must not re-render anything. A capture-phase listener on window
     runs before the stage's own, so each new gesture's origin is known before
     the stage decides whether to take it over. */
  const gesture = useRef({ lastWheel: -Infinity, startedInside: false, stepped: false, acc: 0 });

  useEffect(() => {
    const onWheelCapture = (e: WheelEvent) => {
      const now = performance.now();
      const g = gesture.current;
      if (now - g.lastWheel > GAP) {
        g.startedInside = !!stageRef.current?.contains(e.target as Node);
        g.stepped = false;
        g.acc = 0;
      }
      g.lastWheel = now;
    };
    window.addEventListener('wheel', onWheelCapture, { capture: true, passive: true });
    return () => window.removeEventListener('wheel', onWheelCapture, { capture: true });
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (e: WheelEvent) => {
      const g = gesture.current;
      // Not clicked into yet, a zoom gesture, a sideways swipe, or a page
      // scroll that merely drifted across the frame: leave it to the browser.
      if (!armed || e.ctrlKey || e.shiftKey || !g.startedInside) return;
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * 400 : e.deltaY;
      if (Math.abs(dy) <= Math.abs(e.deltaX)) return;
      // The remainder of a flick that has already stepped is absorbed, so one
      // flick moves exactly one screenshot.
      if (g.stepped) {
        e.preventDefault();
        return;
      }

      const current = slides[active];
      const count = FEATURES[active].shots.length;
      let step: (() => void) | null = null;

      if (dy > 0) {
        if (current < count - 1) step = () => setSlide(active, current + 1);
        else if (active < FEATURES.length - 1)
          step = () => {
            setSlide(active + 1, 0);
            setActive(active + 1);
          };
      } else {
        if (current > 0) step = () => setSlide(active, current - 1);
        else if (active > 0)
          step = () => {
            setSlide(active - 1, FEATURES[active - 1].shots.length - 1);
            setActive(active - 1);
          };
      }
      // Past the very first or very last screenshot the page scrolls as usual.
      if (!step) return;

      e.preventDefault();
      g.acc += dy;
      if (Math.abs(g.acc) < THRESHOLD) return;
      step();
      g.stepped = true;
      g.acc = 0;
    };

    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [active, armed, slides, setSlide]);

  /* ---- tab list keyboard support (WAI-ARIA tabs pattern) ---- */
  const onTabKeyDown = (e: React.KeyboardEvent, i: number) => {
    let next: number | null = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % FEATURES.length;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + FEATURES.length) % FEATURES.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = FEATURES.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  /* ---- scroll indicator: where this screenshot sits in the whole sequence ---- */
  const total = FEATURES.reduce((sum, f) => sum + f.shots.length, 0);
  const position =
    FEATURES.slice(0, active).reduce((sum, f) => sum + f.shots.length, 0) + slides[active];

  return (
    <>
      <div className={`switch${armed ? ' is-armed' : ''}`} ref={frameRef}>
        <div className="switch-list" role="tablist" aria-orientation="vertical" aria-label="Product screens">
          <p className="switch-eyebrow">Features</p>

          <div className="switch-grp">
            {FEATURES.map((feature, i) => (
              <div key={feature.id} style={{ display: 'contents' }}>
                <button
                  className="tab"
                  role="tab"
                  id={`t-${feature.id}`}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  aria-controls={`p-${feature.id}`}
                  aria-selected={i === active}
                  aria-describedby={`c-${feature.id}`}
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                >
                  {feature.label}
                  {feature.shots.length > 1 && (
                    <span className="tab-count">
                      {slides[i] + 1} / {feature.shots.length}
                    </span>
                  )}
                </button>
                <p className="tab-caption" id={`c-${feature.id}`}>
                  <span>{feature.caption}</span>
                </p>
              </div>
            ))}
          </div>

          <p className="switch-hint">{armed ? 'Scroll to browse' : 'Click, then scroll to browse'}</p>
        </div>

        <div className="switch-stage" ref={stageRef}>
          {FEATURES.map((feature, i) => (
            <figure
              key={feature.id}
              className="shot"
              role="tabpanel"
              id={`p-${feature.id}`}
              aria-labelledby={`t-${feature.id}`}
              tabIndex={0}
              hidden={i !== active}
              onKeyDown={(e) => {
                if (feature.shots.length < 2) return;
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                  e.preventDefault();
                  setSlide(i, (slides[i] + 1) % feature.shots.length);
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                  e.preventDefault();
                  setSlide(i, (slides[i] - 1 + feature.shots.length) % feature.shots.length);
                }
              }}
            >
              <div className="shot-area">
                <div
                  className="carousel"
                  // No scroll wheel on a touchscreen, so a tap advances instead.
                  onClick={
                    feature.shots.length > 1
                      ? () => setSlide(i, (slides[i] + 1) % feature.shots.length)
                      : undefined
                  }
                >
                  {feature.shots.map((shot, k) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={shot.src}
                      className={`slide${k === slides[i] ? ' is-on' : ''}`}
                      src={shot.src}
                      alt={shot.alt}
                      width={1600}
                      height={800}
                      // The first screenshot of the first tab is the largest
                      // thing above the fold; the rest wait until they are needed.
                      loading={i === 0 && k === 0 ? 'eager' : 'lazy'}
                      fetchPriority={i === 0 && k === 0 ? 'high' : 'auto'}
                      decoding="async"
                      aria-hidden={k !== slides[i]}
                    />
                  ))}
                </div>
              </div>
            </figure>
          ))}

          <div className="scroll-ind" aria-hidden="true">
            <div className="scroll-rail">
              <div
                className="scroll-thumb"
                style={{ height: `${100 / total}%`, top: `${(position * 100) / total}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <p className="switch-note">
        All screenshots show mock data. Company names, people, properties and figures are for
        illustration only.
      </p>
    </>
  );
}
