import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Ganti ini dengan domain aslimu nanti saat deploy
  const baseUrl = 'https://sablonku.com'; 

  // 2. Ambil semua artikel blog dari database
  const posts = await prisma.post.findMany({
    select: { slug: true, createdAt: true },
  });

  // 3. Buat URL untuk setiap blog
  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.createdAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 4. Gabungkan dengan halaman statis (Home, Custom, Portfolio)
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/custom`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogUrls,
  ];
}