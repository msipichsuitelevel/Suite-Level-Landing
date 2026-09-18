/**
 * Build-time configuration. Every value here is inlined into the exported
 * bundle by Next, so nothing secret may be read in this file - the reCAPTCHA
 * SECRET key in particular lives only in the API's app settings.
 *
 * `process.env.NEXT_PUBLIC_*` must be written out in full rather than looked up
 * dynamically: the inlining is a literal text substitution, so
 * `process.env[name]` would survive into the bundle as an undefined lookup.
 */

const trimSlash = (value: string) => value.replace(/\/+$/, '');

export const SITE_URL = trimSlash(
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.suite-level.com',
);

export const API_URL = trimSlash(process.env.NEXT_PUBLIC_API_URL || '');

export const APP_URL = trimSlash(
  process.env.NEXT_PUBLIC_APP_URL || 'https://app.suite-level.com',
);

export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

/**
 * Which reCAPTCHA product the site key belongs to. A key is registered for exactly
 * one of these and the wrong choice fails with "Invalid site key", so this has to
 * match the reCAPTCHA admin console.
 *
 *   v2-invisible  no widget; the challenge runs on submit and only appears if
 *                 Google decides the visitor needs one. This is what Suite Level uses.
 *   v2-checkbox   the visible "I'm not a robot" tick box.
 *   v3            scored in the background, never interactive.
 */
export type RecaptchaVersion = 'v2-invisible' | 'v2-checkbox' | 'v3';

const RECAPTCHA_VERSIONS: RecaptchaVersion[] = ['v2-invisible', 'v2-checkbox', 'v3'];

export const RECAPTCHA_VERSION: RecaptchaVersion =
  RECAPTCHA_VERSIONS.find((v) => v === process.env.NEXT_PUBLIC_RECAPTCHA_VERSION) ?? 'v2-invisible';

/** v2 invisible and v2 checkbox share one script and one render call. */
export const IS_RECAPTCHA_V2 = RECAPTCHA_VERSION !== 'v3';

/** The endpoint the access-request form posts to. */
export const ACCESS_REQUEST_ENDPOINT = `${API_URL}/api/AccessRequest/Submit`;

export const COMPANY = {
  legalName: 'Suite Level, Inc.',
  name: 'Suite Level',
  email: 'operations@suite-level.com',
  addressLines: ['344 Juniper Ave, Apt 26', 'Carlsbad, CA 92008'],
  locality: 'Carlsbad',
  region: 'CA',
  postalCode: '92008',
  country: 'US',
} as const;

/** Drives the rail's section index and the scroll-spy that highlights it. */
export const SECTIONS = [
  { id: 'product', label: 'Platform' },
  { id: 'share', label: 'Collaborate' },
  { id: 'who', label: 'Who we are' },
  { id: 'access', label: 'Early access' },
  { id: 'faq', label: 'FAQ' },
] as const;
