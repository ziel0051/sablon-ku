'use client';
import { updatePost } from '@/app/actions';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditBlogForm({ post }: { post: any }) {
  const [inputType, setInputType] = useState<'url' | 'upload'>('url');

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl text-gray-900">
        <Link href="/admin" className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 text-sm font-bold">
            <ArrowLeft size={16} /> Batal & Kembali
        </Link>
        <h1 className="text-2xl font-bold mb-6">Edit Artikel</h1>

        <form action={updatePost} className="flex flex-col gap-6">
          <input type="hidden" name="id" value={post.id} />
          <input type="hidden" name="oldImage" value={post.image} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
            <input name="title" type="text" defaultValue={post.title} className="w-full border p-3 rounded-lg" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ganti Gambar (Opsional)</label>
            <p className="text-xs text-gray-500 mb-2">Gambar saat ini: {post.image}</p>
            <input type="hidden" name="imageType" value={inputType} />
            <div className="flex gap-4 mb-3">
               <button type="button" onClick={() => setInputType('url')} className={`px-4 py-2 rounded-full text-sm font-medium ${inputType === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Link URL</button>
               <button type="button" onClick={() => setInputType('upload')} className={`px-4 py-2 rounded-full text-sm font-medium ${inputType === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Upload File</button>
            </div>
            {inputType === 'url' ? (
               <input name="imageUrl" type="text" placeholder="Kosongkan jika tidak ingin mengganti" className="w-full border p-3 rounded-lg" />
            ) : (
               <input name="imageFile" type="file" accept="image/*" className="w-full border p-2 rounded" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Isi Artikel</label>
            <textarea name="content" defaultValue={post.content} className="w-full border p-3 rounded-lg h-60" required />
          </div>

          <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700">Simpan Perubahan</button>
        </form>
    </div>
  );
}