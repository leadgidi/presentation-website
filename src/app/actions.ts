'use server';

import { headers } from 'next/headers';
import { waitlistCopy } from '@/content/site';

export type WaitlistState = { status: 'idle' | 'joined' | 'error'; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const WEBHOOK_TIMEOUT_MS = 5000;
const MAX_ATTEMPTS_PER_WINDOW = 5;
const WINDOW_MS = 60 * 60 * 1000;
const MAX_TRACKED_IPS = 10000;

// ponytail: in-memory per instance, move to a store if the site ever runs on more than one instance
const attemptsByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  if (attemptsByIp.size > MAX_TRACKED_IPS) attemptsByIp.clear();
  const now = Date.now();
  const recent = (attemptsByIp.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  attemptsByIp.set(ip, recent);
  return recent.length > MAX_ATTEMPTS_PER_WINDOW;
}

async function clientIp(): Promise<string> {
  const forwarded = (await headers()).get('x-forwarded-for');
  return forwarded?.split(',')[0].trim() || 'unknown';
}

async function sendToWebhook(email: string): Promise<boolean> {
  const response = await fetch(process.env.WAITLIST_WEBHOOK_URL as string, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, source: 'website', token: process.env.WAITLIST_SECRET }),
    signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
  });
  return response.ok && (await response.text()).trim() === 'ok';
}

export async function joinWaitlist(_previous: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const isBot = Boolean(formData.get('website'));
  if (isBot) return { status: 'joined', message: waitlistCopy.joined };

  const email = String(formData.get('email') ?? '').trim();
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return { status: 'error', message: waitlistCopy.invalidEmail };
  }
  if (isRateLimited(await clientIp())) return { status: 'error', message: waitlistCopy.tooMany };
  if (!process.env.WAITLIST_WEBHOOK_URL) return { status: 'error', message: waitlistCopy.notOpen };

  try {
    const sent = await sendToWebhook(email);
    return sent ? { status: 'joined', message: waitlistCopy.joined } : { status: 'error', message: waitlistCopy.failed };
  } catch {
    return { status: 'error', message: waitlistCopy.failed };
  }
}
