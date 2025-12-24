import NextAuth from 'next-auth';
import { authConfig } from './lib/auth.config';

// Workaround for "ReferenceError: __dirname is not defined" in Edge Runtime
// This is often caused by a dependency (like bcryptjs) being bundled even if not directly used
if (typeof __dirname === 'undefined') {
  (globalThis as any).__dirname = '/';
}

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
