import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://sablonku.com'; // Ganti domain nanti

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Kita larang Google mengindeks halaman Admin
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}