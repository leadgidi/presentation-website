'use client';

import { useActionState, useEffect, useRef } from 'react';
import { joinWaitlist, type WaitlistState } from '@/app/actions';
import { JOINED_EVENT } from '@/components/dot-field';
import { waitlistCopy } from '@/content/site';

const initialState: WaitlistState = { status: 'idle', message: '' };

function announceJoined(element: HTMLElement) {
  const box = element.getBoundingClientRect();
  const detail = { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  window.dispatchEvent(new CustomEvent(JOINED_EVENT, { detail }));
}

export function WaitlistForm() {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialState);
  const container = useRef<HTMLDivElement>(null);
  const joined = state.status === 'joined';

  useEffect(() => {
    if (joined && container.current) announceJoined(container.current);
  }, [joined]);

  return (
    <div className="waitlist" ref={container}>
      {joined ? (
        <p className="waitlist-joined" role="status">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <circle cx="12" cy="12" r="11" fill="currentColor" />
            <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="var(--bg)" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          {state.message}
        </p>
      ) : (
        <form action={formAction} noValidate>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="visually-hidden" aria-hidden="true" />
          <div className="waitlist-field">
            <label htmlFor="waitlist-email" className="visually-hidden">
              {waitlistCopy.placeholder}
            </label>
            <input
              id="waitlist-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={waitlistCopy.placeholder}
              disabled={pending}
            />
            <button type="submit" aria-label={waitlistCopy.submit} disabled={pending}>
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </button>
          </div>
          {state.status === 'error' && (
            <p className="waitlist-message" role="alert">
              {state.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
