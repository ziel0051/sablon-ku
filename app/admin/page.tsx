import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { handleLogout, deletePost, deletePortfolio } from '@/app/actions';
import { Plus, LogOut, FileText, Image as ImageIcon, Pencil } from 'lucide-react';
import { DeleteButton } from '@/components/DeleteButton';

// Supaya data selalu fresh saat dibuka
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
  const portfolios = await prisma.portfolio.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <p className="text-gray-500">Kelola konten websitemu di sini.</p>
        </div>
        <form action={handleLogout}>
          <button className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-lg shadow-sm hover:bg-red-50 border border-red-100 font-bold transition">
            <LogOut size={18} /> Logout
          </button>
        </form>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* === SECTION 1: BLOG === */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
                <FileText className="text-blue-600" />
                <h2 className="text-xl font-bold">Artikel Blog</h2>
            </div>
            <Link href="/admin/blog/create" className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition">
              <Plus size={16} /> Tambah
            </Link>
          </div>

          <div className="space-y-4">
            {posts.length === 0 ? <p className="text-gray-400 italic text-sm">Belum ada artikel.</p> : null}
            {posts.map((post) => (
              <div key={post.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg group hover:bg-blue-50 transition">
                <div className="flex-1 min-w-0 pr-4">
                    <p className="font-bold truncate">{post.title}</p>
                    <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                    {/* TOMBOL EDIT (Pastikan folder admin/blog/edit/[id] ada) */}
                    <Link href={`/admin/blog/edit/${post.id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-md transition" title="Edit">
                        <Pencil size={18} />
                    </Link>
                    
                    {/* TOMBOL DELETE (Pakai komponen baru) */}
                    <DeleteButton id={post.id} action={deletePost} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === SECTION 2: PORTFOLIO === */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
                <ImageIcon className="text-purple-600" />
                <h2 className="text-xl font-bold">Portofolio</h2>
            </div>
            {/* Cek Link Ini: Pastikan mengarah ke /admin/portfolio/create */}
            <Link href="/admin/portfolio/create" className="flex items-center gap-1 bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-purple-700 transition">
              <Plus size={16} /> Tambah
            </Link>
          </div>

          <div className="space-y-4">
            {portfolios.length === 0 ? <p className="text-gray-400 italic text-sm">Belum ada portofolio.</p> : null}
            {portfolios.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg group hover:bg-purple-50 transition">
                <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                    {item.image && (
                        <img src={item.image} className="w-10 h-10 object-cover rounded-md bg-gray-200 shrink-0" alt="thumb" />
                    )}
                    <div className="truncate">
                        <p className="font-bold truncate">{item.title}</p>
                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600">{item.category}</span>
                    </div>
                </div>
                <div className="flex gap-2 shrink-0">
                    {/* TOMBOL EDIT (Pastikan folder admin/portfolio/edit/[id] ada) */}
                    <Link href={`/admin/portfolio/edit/${item.id}`} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-100 rounded-md transition" title="Edit">
                        <Pencil size={18} />
                    </Link>
                    
                    {/* TOMBOL DELETE (Pakai komponen baru) */}
                    <DeleteButton id={item.id} action={deletePortfolio} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}