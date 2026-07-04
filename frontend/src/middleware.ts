import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // In a real application, you would decode the JWT token from the cookies
  // or use next-auth to get the user's role.
  // For demonstration, we assume a "role" cookie is present.
  const role = request.cookies.get('role')?.value || 'Guest';

  const { pathname } = request.nextUrl;

  // Protect Admin Routes
  if (pathname.startsWith('/admin')) {
    if (role !== 'Admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Protect Delivery Rider Routes
  if (pathname.startsWith('/delivery')) {
    if (role !== 'Rider' && role !== 'Admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Protect User Dashboard Routes
  if (pathname.startsWith('/dashboard')) {
    if (role === 'Guest') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Config to match the specific routes we want to protect
export const config = {
  matcher: ['/admin/:path*', '/delivery/:path*', '/dashboard/:path*'],
};
