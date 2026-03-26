'use client';

type AnalyticsPayload = Record<string, unknown>;

const GUEST_ID_KEY = 'guestUid';
const SESSION_ID_KEY = 'sessionUid';
const LAST_IDENTIFY_KEY = 'analyticsLastIdentify';

function safeLocalStorageGet(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalStorageSet(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

function generateId(prefix: string): string {
  const rnd =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${rnd}`;
}

export function getOrCreateGuestUid(): string {
  const existing = safeLocalStorageGet(GUEST_ID_KEY);
  if (existing) return existing;
  const uid = generateId('guest');
  safeLocalStorageSet(GUEST_ID_KEY, uid);
  return uid;
}

export function getOrCreateSessionUid(): string {
  const existing = safeLocalStorageGet(SESSION_ID_KEY);
  if (existing) return existing;
  const sessionUid = generateId('session');
  safeLocalStorageSet(SESSION_ID_KEY, sessionUid);
  return sessionUid;
}

export function getAnalyticsIdentity() {
  const guestUid = getOrCreateGuestUid();
  const sessionUid = getOrCreateSessionUid();
  const userId = safeLocalStorageGet('userId');
  const email = safeLocalStorageGet('userEmail');
  return { guestUid, sessionUid, userId, email };
}

export async function trackEvent(eventType: string, payload: AnalyticsPayload = {}, source?: string) {
  if (typeof window === 'undefined') return;
  const identity = getAnalyticsIdentity();
  const body = {
    eventType,
    source: source || 'web',
    payload: {
      ...identity,
      pageUrl: window.location.href,
      path: window.location.pathname,
      referrer: document.referrer || null,
      userAgent: navigator.userAgent,
      language: navigator.language,
      screen: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString(),
      ...payload,
    },
  };

  const endpoint = '/api/admin/analytics';
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
      const ok = navigator.sendBeacon(endpoint, blob);
      if (ok) return;
    }
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    // swallow analytics failures
  }
}

export function markIdentifySent(email: string) {
  safeLocalStorageSet(LAST_IDENTIFY_KEY, email.toLowerCase());
}

export function shouldSendIdentify(email: string): boolean {
  const last = safeLocalStorageGet(LAST_IDENTIFY_KEY);
  return last !== email.toLowerCase();
}

