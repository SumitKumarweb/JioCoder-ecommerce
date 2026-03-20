import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const canonicalPath = pathname || '/';

  // Block admin routes from being indexed by search engines
  if (pathname.startsWith('/nimda-pro-sumit')) {
    const response = NextResponse.next();
    
    // Add noindex headers to prevent search engine indexing
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
    // Provide canonical path for consistent metadata generation
    response.headers.set('x-canonical-path', canonicalPath);
    
    return response;
  }

  const response = NextResponse.next();
  // Provide canonical path for consistent metadata generation
  response.headers.set('x-canonical-path', canonicalPath);
  return response;
}

export const config = {
  matcher: [
    // Apply to all HTML pages (exclude static assets, Next internals, and API)
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};

