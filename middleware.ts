import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  const publicRoutes = ['/', '/login', '/signup', '/about', '/team', '/changelog', '/posts', '/meeting', '/upcoming', '/join'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/api/auth'));
  
  // Check for auth token (NextAuth session cookie)
  const sessionToken = request.cookies.get('authjs.session-token') || 
                        request.cookies.get('__Secure-authjs.session-token');
  
  // If accessing dashboard without session, redirect to login
  if (pathname.startsWith('/dashboard') && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If logged in and trying to access login/signup, redirect to dashboard
  if ((pathname === '/login' || pathname === '/signup') && sessionToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
