import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // 1. Import Font
import './globals.css';
import { WhatsAppButton } from '@/components/WhatsAppButton';

// 2. DEKLARASI FONT (Bagian ini yang sebelumnya hilang)
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sablon Ku - Custom T-Shirt Design',
  description: 'Buat desain kaos custom Anda sendiri dengan mudah.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      {/* 3. Sekarang 'inter' sudah bisa dibaca di sini */}
      <body className={inter.className}>
        {children}
        
        {/* Tombol WhatsApp Melayang */}
        <WhatsAppButton /> 
      </body>
    </html>
  );
}