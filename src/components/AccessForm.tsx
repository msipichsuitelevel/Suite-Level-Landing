'use client';

import { useEffect, useRef, useState } from 'react';

import { ACCESS_REQUEST_ENDPOINT, COMPANY, IS_RECAPTCHA_V2, RECAPTCHA_VERSION } from '@/lib/site';
import { executeV3, renderV2Widget, type V2Widget } from '@/lib/recaptcha';

const RESTING = 'Free during the beta. No contract, no card.';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Status = 'idle' | 'sending' | 'sent' | 'error';

function validateName(value: string): string {
  const v = value.trim();
  if (!v) return 'Enter your full name.';
  if (v.length < 2) return 'That name looks too short.';
  if (v.length > 200) return 'That name is too long.';
  return '';
}

function validateEmail(value: string): string {
  const v = value.trim();
  if (!v) return 'Enter your email address.';
  if (!EMAIL_RE.test(v)) return 'That email address looks incomplete.';
  return '';
}

/**
 * The access-request form. The address is posted to the Suite Level API, which
 * records it, mints an invite token and emails it. The API is the only thing that
 * can decide whether an address is new: it holds the unique constraint and the
 * reCAPTCHA secret, so nothing here is trusted and nothing here is a check.
 *
 * Suite Level's key is reCAPTCHA **v2 invisible**, so there is no widget to tick.
 * The challenge runs when the form is submitted and most visitors never see it;
 * Google only interrupts when it is unsure. That is why the submit handler has to
 * await a token rather than read one that is already sitting there.
 */
export function AccessForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [sentTo, setSentTo] = useState('');
  // A field shows its error once it has been left (blur) or the form submitted, and
  // from then on updates as you type - so the error clears the moment it is fixed,
  // but nobody is scolded for a field they have not finished yet.
  const [touched, setTouched] = useState({ name: false, email: false });
  const nameError = touched.name ? validateName(name) : '';
  const emailError = touched.email ? validateEmail(email) : '';
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [note, setNote] = useState(RESTING);
  const [noteKind, setNoteKind] = useState<'' | 'err' | 'ok'>('');

  // v2 mounts into this element. Invisible renders nothing into it; the checkbox
  // variant draws its widget here.
  const captchaRef = useRef<HTMLDivElement | null>(null);
  const widget = useRef<V2Widget | null>(null);
  // grecaptcha refuses to render twice into the same element, and React runs
  // effects twice in development under StrictMode. A ref survives that simulated
  // remount, so the second pass is skipped instead of throwing.
  const rendered = useRef(false);
  const honeypot = useRef<HTMLInputElement | null>(null);
  // Focus moves to the confirmation: the form it replaces is gone, so without
  // this a keyboard or screen reader user is left on a detached element.
  const sentHeading = useRef<HTMLHeadingElement | null>(null);

  const say = (text: string, kind: '' | 'err' | 'ok' = '') => {
    setNote(text);
    setNoteKind(kind);
  };

  useEffect(() => {
    if (status === 'sent') sentHeading.current?.focus();
  }, [status]);

  useEffect(() => {
    if (!IS_RECAPTCHA_V2) return;
    if (rendered.current) return;
    rendered.current = true;

    // Rendered once, on mount, so the challenge is ready before anyone submits.
    // Rendering on submit instead would add a visible delay to every request.
    renderV2Widget(captchaRef.current!)
      .then((w) => {
        widget.current = w;
      })
      .catch((err: unknown) => {
        // Say what actually went wrong. Blaming an ad blocker unconditionally
        // sent us hunting for one that was never there.
        const reason = err instanceof Error ? err.message : String(err);
        const blocked = /failed to load|never became ready/i.test(reason);
        say(
          blocked
            ? `The spam check could not load, which usually means a browser extension or network is blocking Google. Reload, or email ${COMPANY.email} and we will add you by hand.`
            : `The spam check could not start (${reason}). Reload, or email ${COMPANY.email} and we will add you by hand.`,
          'err',
        );
      });
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;

    // Every field shows its state at once, rather than one error per click.
    setTouched({ name: true, email: true });
    const nameProblem = validateName(name);
    const emailProblem = validateEmail(email);
    if (nameProblem || emailProblem) {
      (nameProblem ? nameRef : emailRef).current?.focus();
      return;
    }

    const fullName = name.trim();
    const value = email.trim();
    // Hidden from people, filled in by the simplest bots. Answer as though it
    // worked, so there is no signal to tune against.
    if (honeypot.current?.value) {
      setSentTo(value);
      setStatus('sent');
      return;
    }

    // The challenge can put a puzzle on screen, so this is the point where the
    // visitor may have to do something. The button reflects that.
    setStatus('sending');
    say('Checking…');

    let token: string;
    try {
      token = IS_RECAPTCHA_V2
        ? await (widget.current?.getToken() ??
            Promise.reject(new Error('The spam check is not ready yet. Reload the page.')))
        : await executeV3('access_request');
    } catch (err) {
      setStatus('error');
      widget.current?.reset();
      say(err instanceof Error ? err.message : 'The spam check did not complete.', 'err');
      return;
    }

    say('Sending…');

    try {
      const response = await fetch(ACCESS_REQUEST_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: fullName, email: value, recaptchaToken: token }),
      });

      // The API returns OperationResult on this endpoint, which means a REJECTED
      // request still comes back HTTP 200 with { isSuccess: false, message }.
      // Checking response.ok alone would report every rejection - including
      // "already invited" - as a success. Both have to be checked.
      let payload: { isSuccess?: boolean; message?: string } | null = null;
      try {
        payload = await response.json();
      } catch {
        // 429 from the rate limiter and 5xx have no JSON body; handled below.
      }

      if (!response.ok || payload?.isSuccess === false) {
        setStatus('error');
        // A v2 token is single-use, so a retry needs a fresh one.
        widget.current?.reset();

        // The API's own message is written for the reader ("already invited, check
        // your spam folder"), so it is shown as-is. Only when there is none does a
        // generic message stand in.
        const detail =
          typeof payload?.message === 'string' && payload.message.trim() ? payload.message : '';
        const fallback =
          response.status === 429
            ? 'Too many attempts. Wait a minute and try again.'
            : `That didn't send. Try again, or email ${COMPANY.email} and we'll add you by hand.`;
        say(detail || fallback, 'err');
        return;
      }

      setSentTo(value);
      setStatus('sent');
    } catch {
      setStatus('error');
      widget.current?.reset();
      say(`That didn't send. Try again, or email ${COMPANY.email} and we'll add you by hand.`, 'err');
    }
  };

  if (status === 'sent') {
    return (
      <div className="closer is-sent" id="join" role="status">
        <div className="sent">
          <span className="sent-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12.5 9.5 18 20 6.5" />
            </svg>
          </span>

          <div className="sent-body">
            <h3 tabIndex={-1} ref={sentHeading}>
              You&rsquo;re on the waitlist
            </h3>
            <p>
              We have your details and will email <span className="sent-to">{sentTo}</span> when a
              place opens up.
            </p>

            <p className="sent-spam">
              We are letting people in a few at a time, so this may take a little while.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="closer" id="join">
      <p>
        Join the waitlist. We are letting brokers in a few at a time, so we can work closely with
        everyone on it. Tell us who you are and we will be in touch when there is a place for you.
      </p>

      <form onSubmit={onSubmit} noValidate>
        <div className="fields">
          <input
            id="access-name"
            ref={nameRef}
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Your full name"
            aria-label="Full name"
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? 'access-name-error' : undefined}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (noteKind === 'err') say(RESTING);
            }}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            required
          />
          {nameError && (
            <p className="field-err" id="access-name-error">
              {nameError}
            </p>
          )}

          <div className="row">
            <input
              id="access-email"
              ref={emailRef}
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@brokerage.com"
              aria-label="Work email address"
              aria-invalid={emailError ? true : undefined}
              aria-describedby={emailError ? 'access-email-error access-note' : 'access-note'}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (noteKind === 'err') say(RESTING);
              }}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              required
            />
            <button className="btn" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Joining…' : 'Join the waitlist'}
            </button>
          </div>
          {emailError && (
            <p className="field-err" id="access-email-error">
              {emailError}
            </p>
          )}
        </div>

        {/* v2 mount point. Invisible renders no box, so the container stays at zero
            height and the layout is unchanged. */}
        {IS_RECAPTCHA_V2 && (
          <div
            className={RECAPTCHA_VERSION === 'v2-invisible' ? 'captcha captcha-invisible' : 'captcha'}
            ref={captchaRef}
          />
        )}

        {/* aria-live so the outcome reaches a screen reader: the confirmation
            replaces the form rather than moving focus. */}
        <p className={`note${noteKind ? ` ${noteKind}` : ''}`} id="access-note" aria-live="polite">
          {note}
        </p>
        <p className="privacy">
          We only use your details to contact you about Suite Level. By joining you agree to our{' '}
          <a href="/privacy-policy/">Privacy Policy</a>.
        </p>

        <input
          type="text"
          name="_gotcha"
          ref={honeypot}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
        />
      </form>
    </div>
  );
}
