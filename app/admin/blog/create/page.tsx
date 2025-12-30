'use client'; 

import { createPost } from '@/app/actions';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CreatePostPage() {
  const [inputType, setInputType] = useState<'url' | 'upload'>('url');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-gray-900">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <Link href="/admin" className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 text-sm font-bold">
            <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>

        <h1 className="text-2xl font-bold mb-6 text-gray-800">Tulis Blog Baru</h1>
        
        <form action={createPost} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Artikel</label>
            <input name="title" type="text" className="w-full border border-gray-300 p-3 rounded-lg" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Sampul</label>
            <input type="hidden" name="imageType" value={inputType} />
            <div className="flex gap-4 mb-3">
              <button type="button" onClick={() => setInputType('url')} className={`px-4 py-2 rounded-full text-sm font-medium ${inputType === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Link URL</button>
              <button type="button" onClick={() => setInputType('upload')} className={`px-4 py-2 rounded-full text-sm font-medium ${inputType === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Upload File</button>
            </div>
            {inputType === 'url' ? (
              <input name="imageUrl" type="text" placeholder="https://..." className="w-full border border-gray-300 p-3 rounded-lg" />
            ) : (
              <input name="imageFile" type="file" accept="image/*" className="w-full text-sm border p-2 rounded" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Isi Artikel</label>
            <textarea name="content" className="w-full border border-gray-300 p-3 rounded-lg h-60" required />
          </div>

          <button type="submit" className="bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-all">Publish</button>
        </form>
      </div>
    </div>
  );
}