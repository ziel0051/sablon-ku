import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // Lindungi semua route yang berawalan /admin
  matcher: ['/admin/:path*'],
};