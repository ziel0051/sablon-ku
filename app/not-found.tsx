import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <h1 className="text-9xl font-black text-indigo-200">404</h1>
      <h2 className="text-3xl font-bold text-gray-800 mt-4">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        Maaf, halaman yang Anda cari mungkin sudah dihapus atau link-nya salah. Jangan khawatir, mari kembali ke jalan yang benar.
      </p>
      
      <div className="mt-8 flex gap-4">
        <Link 
          href="/"
          className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 transition"
        >
          Kembali ke Beranda
        </Link>
        <Link 
          href="/custom"
          className="bg-white text-indigo-600 border border-indigo-200 px-6 py-3 rounded-full font-bold hover:bg-indigo-50 transition"
        >
          Buat Desain Kaos
        </Link>
      </div>
    </div>
  );
}