// components/Footer.tsx
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold mb-4">Sablon Ku</h3>
            <p className="text-gray-400 text-sm mb-4">
              Menghasilkan kaos berkualitas dengan desain eksklusif Anda. Teknologi sablon modern untuk hasil terbaik.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white"><Facebook size={20} /></Link>
              <Link href="#" className="text-gray-400 hover:text-white"><Instagram size={20} /></Link>
              <Link href="#" className="text-gray-400 hover:text-white"><Twitter size={20} /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Menu Cepat</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition">Beranda</Link></li>
              <li><Link href="/custom" className="hover:text-white transition">Design Tool</Link></li>
              <li><Link href="/portfolio" className="hover:text-white transition">Portfolio</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Sablon Custom</li>
              <li>Desain Eksklusif</li>
              <li>Produksi Massal</li>
              <li>Konsultasi Desain</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hubungi Kami</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Phone: +62 812 3456 78</li>
              <li>Email: info@sablonku.com</li>
              <li>Address: Jl. Sablon No. 123, Kota Kreatif, Indonesia</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Sablon Ku. Semua hak dilindungi. | SEO Optimized Website
        </div>
      </div>
    </footer>
  );
};