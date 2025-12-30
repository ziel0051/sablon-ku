import { prisma } from '@/lib/prisma';
import EditPortfolioForm from './form';
import { notFound } from 'next/navigation';

// PERUBAHAN 1: Definisikan params sebagai Promise
export default async function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  
  // PERUBAHAN 2: Await params
  const { id } = await params;

  const item = await prisma.portfolio.findUnique({ where: { id } });
  
  if (!item) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <EditPortfolioForm item={item} />
    </div>
  );
}