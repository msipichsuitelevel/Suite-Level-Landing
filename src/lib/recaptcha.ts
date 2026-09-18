/**
 * reCAPTCHA loader and token source.
 *
 * Only the SITE key is used here, and only in the browser. It is public by design:
 * it identifies the site to Google and proves nothing on its own. The SECRET key
 * never leaves the API's app settings, and the token produced here is worthless
 * until the API verifies it against that secret.
 *
 * Three products are supported because a site key is registered for exactly one of
 * them and the wrong one fails with "Invalid site key". Suite Level uses
 * v2 invisible, which is the default.
 */

import { IS_RECAPTCHA_V2, RECAPTCHA_SITE_KEY, RECAPTCHA_VERSION } from '@/lib/site';

type RenderParams = {
  sitekey: string;
  size?: 'invisible' | 'normal' | 'compact';
  badge?: 'bottomright' | 'bottomleft' | 'inline';
  callback: (token: string) => void;
  'expired-callback': () => void;
  'error-callback': () => void;
};

type Grecaptcha = {
  ready: (cb: () => void) => void;
  render: (container: HTMLElement, params: RenderParams) => number;
  reset: (widgetId?: number) => void;
  /** v2: triggers the challenge for a rendered widget. v3: returns a token directly. */
  execute: ((widgetId: number) => void) & ((siteKey: string, options: { action: string }) => Promise<string>);
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

const SCRIPT_ID = 'recaptcha-script';

/** One in-flight load shared by every caller, so the script is injected once. */
let loading: Promise<Grecaptcha> | null = null;

export function loadRecaptcha(): Promise<Grecaptcha> {
  if (loading) return loading;

  loading = new Promise<Grecaptcha>((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('reCAPTCHA can only load in the browser'));
      return;
    }
    if (!RECAPTCHA_SITE_KEY) {
      reject(new Error('NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set'));
      return;
    }
    if (window.grecaptcha?.render) {
      resolve(window.grecaptcha);
      return;
    }
    if (document.getElementById(SCRIPT_ID)) {
      // Another caller injected it but the API is not ready yet. Nothing to attach a
      // load listener to that is guaranteed to fire, so poll briefly instead of
      // waiting on an event that may already have passed.
      waitForApi(resolve, reject);
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    // v2 (both sizes) renders explicitly so the widget's callbacks are ours to wire.
    script.src = IS_RECAPTCHA_V2
      ? 'https://www.google.com/recaptcha/api.js?render=explicit'
      : `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(RECAPTCHA_SITE_KEY)}`;
    script.async = true;
    script.defer = true;

    script.addEventListener('load', () => waitForApi(resolve, reject));
    script.addEventListener('error', () => {
      // Let a later attempt retry rather than caching the failure: this is usually a
      // blocked network or an ad blocker, and both can change between attempts.
      loading = null;
      reject(new Error('reCAPTCHA failed to load'));
    });

    document.head.appendChild(script);
  });

  return loading;
}

/** `grecaptcha.ready` only exists once the library has parsed; poll until it does. */
function waitForApi(resolve: (api: Grecaptcha) => void, reject: (e: Error) => void) {
  const deadline = Date.now() + 10_000;
  const tick = () => {
    const api = window.grecaptcha;
    if (api?.ready) {
      api.ready(() => resolve(api));
      return;
    }
    if (Date.now() > deadline) {
      loading = null;
      reject(new Error('reCAPTCHA loaded but never became ready'));
      return;
    }
    setTimeout(tick, 100);
  };
  tick();
}

/** Runs the invisible v3 check and returns a fresh token. */
export async function executeV3(action: string): Promise<string> {
  const api = await loadRecaptcha();
  return (api.execute as (k: string, o: { action: string }) => Promise<string>)(
    RECAPTCHA_SITE_KEY,
    { action },
  );
}

/**
 * Renders a v2 widget and returns a handle that turns its callback-based flow into
 * a promise.
 *
 * v2 invisible has no visible control: nothing happens until `execute()` is called,
 * and the token arrives later on the widget's `callback`. So a submit has to kick
 * off `execute()` and then wait, which is what `getToken` does. v2 checkbox fills
 * its token in as soon as the visitor ticks the box, so `execute()` is a no-op there
 * and `getToken` resolves immediately with whatever the tick produced.
 */
export type V2Widget = {
  /** Resolves with a token, or rejects if the visitor dismisses or it errors out. */
  getToken: () => Promise<string>;
  reset: () => void;
};

export async function renderV2Widget(container: HTMLElement): Promise<V2Widget> {
  const api = await loadRecaptcha();
  const invisible = RECAPTCHA_VERSION === 'v2-invisible';

  let token: string | null = null;
  let pending: { resolve: (t: string) => void; reject: (e: Error) => void } | null = null;

  const settle = (value: string | null, error?: string) => {
    token = value;
    if (!pending) return;
    const p = pending;
    pending = null;
    if (value) p.resolve(value);
    else p.reject(new Error(error ?? 'reCAPTCHA did not complete'));
  };

  const widgetId = api.render(container, {
    sitekey: RECAPTCHA_SITE_KEY,
    size: invisible ? 'invisible' : 'normal',
    // The floating badge is hidden in CSS, which Google allows only when the page
    // shows the reCAPTCHA attribution instead. AccessForm renders that line.
    badge: 'bottomright',
    callback: (t) => settle(t),
    'expired-callback': () => settle(null, 'The spam check expired. Please try again.'),
    'error-callback': () => settle(null, 'The spam check could not run. Please try again.'),
  });

  return {
    getToken: () =>
      new Promise<string>((resolve, reject) => {
        if (token) {
          resolve(token);
          return;
        }
        if (!invisible) {
          // Checkbox: no token means the box was never ticked. Nothing to execute.
          reject(new Error('Please confirm you are not a robot.'));
          return;
        }
        pending = { resolve, reject };
        // If the visitor closes the challenge without solving it, Google calls no
        // callback at all, so without this the promise would never settle and the
        // button would stay disabled forever.
        const timeout = setTimeout(() => {
          if (pending) {
            pending = null;
            reject(new Error('The spam check timed out. Please try again.'));
          }
        }, 120_000);
        const clearOnSettle = { resolve, reject };
        pending = {
          resolve: (t) => { clearTimeout(timeout); clearOnSettle.resolve(t); },
          reject: (e) => { clearTimeout(timeout); clearOnSettle.reject(e); },
        };
        (api.execute as (id: number) => void)(widgetId);
      }),
    reset: () => {
      token = null;
      pending = null;
      api.reset(widgetId);
    },
  };
}
