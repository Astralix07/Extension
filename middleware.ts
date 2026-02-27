import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;
 
  // If the user is logged in and trying to access the login page, redirect them to the admin dashboard.
  if (session === 'admin-logged-in' && pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
 
  // If the user is not logged in and trying to access a protected admin page, redirect them to the login page.
  if (session !== 'admin-logged-in' && pathname !== '/admin/login') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
 
  return NextResponse.next();
}
 
export const config = {
  matcher: ['/admin', '/admin/:path*'],
};