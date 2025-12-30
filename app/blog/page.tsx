import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react'; // Kita pakai icon panah biar cantik

// Pastikan revalidate data agar tidak cache selamanya (opsional, untuk Next.js terbaru)
export const dynamic = 'force-dynamic';

export default async function BlogListPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      {/* --- TAMBAHAN: NAVBAR --- */}
      <nav className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link 
          href="/" 
          className="flex items-center gap-2 font-bold text-lg hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Dashboard</span>
        </Link>
        <div className="font-black text-xl tracking-tight uppercase">BLOG & ARTIKEL</div>
      </nav>

      {/* Content Blog */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Wawasan Terbaru</h1>
            <p className="text-gray-500">Tips desain, tren fashion, dan panduan sablon untukmu.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group h-full">
              <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-white">
                {/* Gambar Thumbnail */}
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  {post.image ? (
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                
                {/* Text Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <div className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                    {/* Hapus tag HTML dari preview content jika ada */}
                    {post.content.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                  </div>
                  <span className="inline-block mt-auto text-blue-600 font-semibold text-sm group-hover:underline">
                    Baca Selengkapnya →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">Belum ada artikel yang diposting.</p>
            <Link href="/admin/create" className="text-blue-600 font-bold mt-2 inline-block">
                Buat Artikel Pertama
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}