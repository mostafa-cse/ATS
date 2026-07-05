import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const role = request.cookies.get('role')?.value || 'Guest';
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (role !== 'Admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  if (pathname.startsWith('/delivery')) {
    if (role !== 'Rider' && role !== 'Admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  if (pathname.startsWith('/dashboard')) {
    if (role === 'Guest') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/delivery/:path*', '/dashboard/:path*'],
};