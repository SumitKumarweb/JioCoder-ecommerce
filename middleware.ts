import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const canonicalPath = pathname || '/';
  const adminSecret = process.env.ADMIN_SECRET || process.env.NEXT_PUBLIC_ADMIN_SECRET;

  // Protect admin API endpoints (optional: only enforced when ADMIN_SECRET is set)
  if (pathname.startsWith('/api/admin')) {
    if (adminSecret) {
      const headerSecret =
        request.headers.get('x-admin-secret') ||
        (() => {
          const auth = request.headers.get('authorization') || '';
          const m = auth.match(/^Bearer\s+(.+)$/i);
          return m?.[1] || '';
        })();

      if (!headerSecret || headerSecret !== adminSecret) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          {
            status: 401,
            headers: {
              'Cache-Control': 'no-store',
            },
          }
        );
      }
    }

    // Canonical header (harmless for APIs, but consistent)
    const res = NextResponse.next();
    res.headers.set('x-canonical-path', canonicalPath);
    return res;
  }

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
    '/nimda-pro-sumit/:path*',
    '/api/admin/:path*',
    // Apply to all HTML pages (exclude static assets, Next internals, and API)
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt).*)',
  ],
};

