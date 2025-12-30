import TshirtDesigner from '@/components/TshirtDesigner';
import Link from 'next/link';

export default function CustomPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar Simple */}
      <nav className="p-6 border-b border-gray-100 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">← Kembali ke Dashboard</Link>
        <h1 className="font-bold text-blue-600">STUDIO DESAIN</h1>
      </nav>

      <div className="flex flex-col items-center justify-center py-10">
        <h2 className="text-3xl font-bold mb-2">Mulai Desain Kaosmu</h2>
        <p className="text-gray-500 mb-8">Geser, tambah teks, dan kreasikan idemu.</p>
        
        {/* Panggil Komponen Designer Disini */}
        <TshirtDesigner />
      </div>
    </div>
  );
}