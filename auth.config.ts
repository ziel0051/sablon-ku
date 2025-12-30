import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login', // Jika belum login, user akan dilempar ke sini
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');

      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect ke halaman login jika belum masuk
      }
      return true;
    },
  },
  providers: [], // Kita isi providernya nanti di auth.ts
} satisfies NextAuthConfig;