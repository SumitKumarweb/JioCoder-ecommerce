import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block admin routes from being indexed by search engines
  if (pathname.startsWith('/nimda-pro-sumit')) {
    const response = NextResponse.next();
    
    // Add noindex headers to prevent search engine indexing
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/nimda-pro-sumit/:path*',
  ],
};

