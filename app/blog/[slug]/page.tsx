import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Calendar } from 'lucide-react';

interface BlogPostProps {
  params: { slug: string };
}

// 1. GENERATE METADATA (SEO OTOMATIS)
export async function generateMetadata({ params }: BlogPostProps) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });
  
  if (!post) {
    return {
      title: 'Artikel Tidak Ditemukan',
    };
  }

  // URL Gambar: Gunakan gambar artikel atau gambar default jika kosong
  const ogImage = post.image || '/images/og-default.jpg'; 
  const cleanDescription = post.content.substring(0, 160).replace(/<[^>]*>?/gm, '');

  return {
    title: `${post.title} | Blog Sablon Ku`,
    description: cleanDescription,
    openGraph: {
      title: post.title,
      description: cleanDescription,
      // Ganti domain ini saat deploy nanti
      url: `https://sablonku.com/blog/${post.slug}`, 
      siteName: 'Sablon Ku',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
        },
      ],
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      authors: ['Admin Sablon Ku'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: cleanDescription,
      images: [ogImage],
    },
  };
}

// 2. KOMPONEN UTAMA HALAMAN
export default async function BlogPost({ params }: BlogPostProps) {
  // Ambil data post dari database
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });

  // Jika tidak ketemu, lempar ke halaman 404
  if (!post) return notFound();

  // 3. SCHEMA MARKUP (BUMBU RAHASIA GOOGLE)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.image ? [post.image] : [],
    datePublished: post.createdAt.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Sablon Ku',
    },
    description: post.content.substring(0, 160).replace(/<[^>]*>?/gm, ''),
  };

  return (
    <>
      {/* Inject Schema ke Head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="min-h-screen bg-white text-gray-900 pb-20">
        
        {/* Tombol Kembali */}
        <div className="max-w-3xl mx-auto pt-10 px-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-medium">
            <ArrowLeft size={18} />
            Kembali ke Daftar Blog
          </Link>
        </div>

        <article className="max-w-3xl mx-auto py-8 px-4">
          {/* Header Artikel */}
          <header className="mb-10 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-4">
              <Calendar size={16} />
              <time dateTime={post.createdAt.toISOString()}>
                {new Date(post.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </time>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight text-gray-900">
              {post.title}
            </h1>
          </header>

          {/* Gambar Utama */}
          {post.image && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Isi Konten */}
          <div className="prose prose-lg prose-indigo max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>

          {/* Share / CTA Kecil di Bawah Artikel */}
          <div className="mt-16 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 mb-4">Suka dengan artikel ini?</p>
            <Link 
              href="/custom"
              className="inline-block bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition"
            >
              Coba Desain Kaos Sendiri Sekarang
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}