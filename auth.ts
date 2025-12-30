import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // Cek username 'admin' dan password dari .env
        if (
          credentials.username === 'admin' &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          // Jika benar, kembalikan data user dummy
          return { id: '1', name: 'Admin', email: 'admin@kaoscustom.com' };
        }
        return null; // Jika salah, return null (gagal login)
      },
    }),
  ],
});