import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sablon Ku - Custom T-Shirt Design & Printing',
  description: 'Buat desain kaos custom Anda sendiri dengan design tool kami yang mudah digunakan. Kualitas terbaik dengan harga terjangkau.',
  keywords: ['sablon', 'kaos custom', 'design tool', 'printing', 'konveksi'],
  openGraph: {
    title: 'Sablon Ku - Custom T-Shirt Design & Printing',
    description: 'Buat desain kaos custom Anda sendiri dengan design tool kami yang mudah digunakan.',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg', // Pastikan nanti ada gambar ini atau ganti placeholder
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-600 to-purple-800 text-white py-24 relative overflow-hidden">
          {/* Background Pattern (Optional decoration) */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                Buat Desain Kaos Anda Sendiri
              </h1>
              <p className="text-xl mb-10 max-w-2xl mx-auto text-indigo-100 leading-relaxed">
                Dengan Design Tool gratis kami, Anda bisa membuat desain kaos yang unik dan menarik. Wujudkan kreativitas Anda sekarang tanpa batas!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* LINK DISESUAIKAN: mengarah ke /custom */}
                <Link
                  href="/custom"
                  className="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition shadow-lg transform hover:-translate-y-1"
                >
                  Mulai Desain Sekarang
                </Link>
                <Link
                  href="/portfolio"
                  className="bg-transparent text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition border-2 border-white"
                >
                  Lihat Portfolio
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
              Mengapa Memilih Kami?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
                <div className="text-5xl mb-6 bg-indigo-50 w-16 h-16 flex items-center justify-center rounded-xl">🎨</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Design Tool Mudah</h3>
                <p className="text-gray-600 leading-relaxed">
                  Interface yang user-friendly memudahkan siapa saja untuk membuat desain kaos yang profesional tanpa skill khusus.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
                <div className="text-5xl mb-6 bg-yellow-50 w-16 h-16 flex items-center justify-center rounded-xl">⚡</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Produksi Cepat</h3>
                <p className="text-gray-600 leading-relaxed">
                  Kami memproduksi kaos custom Anda dengan cepat dan berkualitas tinggi menggunakan teknologi sablon terbaru.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
                <div className="text-5xl mb-6 bg-green-50 w-16 h-16 flex items-center justify-center rounded-xl">💰</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Harga Terjangkau</h3>
                <p className="text-gray-600 leading-relaxed">
                  Dapatkan harga terbaik untuk produk berkualitas. Kami juga menawarkan diskon untuk pemesanan dalam jumlah besar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
              Cara Bekerja Kami
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {/* Garis penghubung (Hidden on mobile) */}
                <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gray-100 -z-10"></div>
                
              {[
                { num: '1', title: 'Desain', desc: 'Buat atau unggah desain Anda di web kami.' },
                { num: '2', title: 'Pilih Kaos', desc: 'Pilih warna, bahan, dan ukuran kaos.' },
                { num: '3', title: 'Pesan', desc: 'Lakukan pembayaran aman & mudah.' },
                { num: '4', title: 'Terima', desc: 'Kaos dikirim langsung ke pintu rumah Anda.' },
              ].map((step, idx) => (
                <div key={idx} className="text-center relative bg-white md:bg-transparent pt-4 md:pt-0">
                  <div className="w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-lg border-4 border-white">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 text-sm px-4">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-indigo-600 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Siap Membuat Desain Kaos Impian Anda?</h2>
            <p className="text-xl mb-10 text-indigo-100">
              Gunakan Design Tool gratis kami sekarang dan lihat hasilnya secara real-time. Tidak perlu install aplikasi apapun.
            </p>
            {/* LINK DISESUAIKAN: mengarah ke /custom */}
            <Link
              href="/custom"
              className="inline-block bg-white text-indigo-600 px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition shadow-xl text-lg"
            >
              Mulai Sekarang →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}