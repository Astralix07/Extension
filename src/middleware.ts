import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;
  const isLoggedIn = session === 'admin-logged-in';
 
  // If the user is trying to access the login page
  if (pathname === '/admin/login') {
    // If they are already logged in, redirect them to the admin dashboard
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Otherwise, allow them to see the login page
    return NextResponse.next();
  }
 
  // For any other admin page, if the user is not logged in, redirect them to the login page
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
 
  // If they are logged in, allow them to access the protected page
  return NextResponse.next();
}
 
export const config = {
  matcher: ['/admin/:path*', '/admin'],
};