// components/Header.tsx
import Link from 'next/link';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-bold text-xl text-gray-900">Sablon Ku</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-500 hover:text-indigo-600 font-medium transition">
              Beranda
            </Link>
            {/* Link ini mengarah ke /custom (T-Shirt Designer yang sudah kita buat) */}
            <Link href="/custom" className="text-gray-500 hover:text-indigo-600 font-medium transition">
              Design Tool
            </Link>
            <Link href="/portfolio" className="text-gray-500 hover:text-indigo-600 font-medium transition">
              Portfolio
            </Link>
            <Link href="/blog" className="text-gray-500 hover:text-indigo-600 font-medium transition">
              Blog
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center">
             {/* Bisa diarahkan ke WhatsApp atau Halaman Kontak */}
            <Link 
              href="https://wa.me/62812345678" 
              className="bg-green-500 text-white px-4 py-2 rounded-md font-medium hover:bg-green-600 transition"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};