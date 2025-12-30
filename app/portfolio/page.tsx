import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Agar data selalu update

export default async function PortfolioPage() {
  // Ambil data dari database
  const portfolios = await prisma.portfolio.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-gray-900">
        
        {/* Header Section */}
        <section className="bg-purple-900 text-white py-20 text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Portofolio Kami</h1>
            <p className="text-purple-200 max-w-2xl mx-auto">
                Lihat hasil karya sablon terbaik yang telah kami kerjakan untuk berbagai klien.
            </p>
        </section>

        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          
          {portfolios.length === 0 ? (
             <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500">Belum ada portofolio yang ditampilkan.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolios.map((item) => (
                <div key={item.id} className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 group bg-white hover:-translate-y-1 transition-transform duration-300">
                    {/* Gambar */}
                    <div className="h-64 w-full bg-gray-100 overflow-hidden relative">
                        {item.image ? (
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                        )}
                        <div className="absolute top-4 left-4">
                            <span className="bg-white/90 backdrop-blur text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm">
                                {item.category}
                            </span>
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                        <h3 className="font-bold text-xl mb-2 text-gray-900">{item.title}</h3>
                        <p className="text-gray-500 text-sm">Project selesai pada {new Date(item.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
                    </div>
                </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}