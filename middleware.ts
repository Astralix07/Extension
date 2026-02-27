import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  // If user is trying to access a protected admin route and is not logged in, redirect to login
  if (isAdminPath && !isLoginPage && session !== 'admin-logged-in') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  // If user is logged in and tries to access login page, redirect to admin dashboard
  if (isLoginPage && session === 'admin-logged-in') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
};
