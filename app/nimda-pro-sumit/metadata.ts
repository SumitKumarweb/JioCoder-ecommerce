import { Metadata } from 'next';

export const adminMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
  },
  other: {
    'googlebot': 'noindex, nofollow',
  },
};

