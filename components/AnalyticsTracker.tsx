'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  getAnalyticsIdentity,
  getOrCreateGuestUid,
  markIdentifySent,
  shouldSendIdentify,
  trackEvent,
} from '@/lib/analytics/client';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousUrlRef = useRef('');

  useEffect(() => {
    const guestUid = getOrCreateGuestUid();
    if (!guestUid) return;

    const guestSeenKey = `guestSeen:${guestUid}`;
    const alreadySeen = window.localStorage.getItem(guestSeenKey);
    if (!alreadySeen) {
      window.localStorage.setItem(guestSeenKey, '1');
      trackEvent('guest_user_created', { guestUid }, 'web-init');
    }
  }, []);

  useEffect(() => {
    const query = searchParams?.toString();
    const page = query ? `${pathname}?${query}` : pathname;
    if (!page) return;

    if (previousUrlRef.current === page) return;
    previousUrlRef.current = page;

    trackEvent('page_view', { page }, 'web-router');
  }, [pathname, searchParams]);

  useEffect(() => {
    const syncIdentity = () => {
      const identity = getAnalyticsIdentity();
      if (!identity.email) return;
      if (!shouldSendIdentify(identity.email)) return;
      markIdentifySent(identity.email);
      trackEvent(
        'identify_user',
        {
          linked: true,
          email: identity.email,
          userId: identity.userId || null,
          guestUid: identity.guestUid,
        },
        'web-auth'
      );
    };

    syncIdentity();
    window.addEventListener('storage', syncIdentity);
    window.addEventListener('userLoggedIn', syncIdentity as EventListener);
    return () => {
      window.removeEventListener('storage', syncIdentity);
      window.removeEventListener('userLoggedIn', syncIdentity as EventListener);
    };
  }, []);

  return null;
}

