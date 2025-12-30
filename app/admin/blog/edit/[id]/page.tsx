import { prisma } from '@/lib/prisma';
import EditBlogForm from './form';
import { notFound } from 'next/navigation';

// PERUBAHAN 1: Definisikan params sebagai Promise
export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  
  // PERUBAHAN 2: Await params sebelum mengambil ID-nya
  const { id } = await params;

  // Sekarang 'id' sudah berisi string yang benar
  const post = await prisma.post.findUnique({ where: { id } });
  
  if (!post) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <EditBlogForm post={post} />
    </div>
  );
}