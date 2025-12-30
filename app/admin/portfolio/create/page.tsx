'use client';

import { createPortfolio } from '@/app/actions';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CreatePortfolioPage() {
  const [inputType, setInputType] = useState<'url' | 'upload'>('url');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-gray-900">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-xl">
        
        <Link href="/admin" className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 text-sm font-bold">
            <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>

        <h1 className="text-2xl font-bold mb-6 text-gray-800">Tambah Portofolio</h1>
        
        <form action={createPortfolio} className="flex flex-col gap-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Project</label>
            <input name="title" type="text" className="w-full border border-gray-300 p-3 rounded-lg" required placeholder="Contoh: Kaos Gathering PT Maju" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select name="category" className="w-full border border-gray-300 p-3 rounded-lg bg-white" required>
                <option value="Event">Event</option>
                <option value="Komunitas">Komunitas</option>
                <option value="Corporate">Corporate / Kantor</option>
                <option value="Satuan">Satuan / Personal</option>
                <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* PILIHAN GAMBAR (Sama kayak Blog) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Hasil</label>
            <input type="hidden" name="imageType" value={inputType} />
            <div className="flex gap-4 mb-3">
              <button type="button" onClick={() => setInputType('url')} className={`px-4 py-2 rounded-full text-sm font-medium ${inputType === 'url' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>Link URL</button>
              <button type="button" onClick={() => setInputType('upload')} className={`px-4 py-2 rounded-full text-sm font-medium ${inputType === 'upload' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>Upload File</button>
            </div>
            {inputType === 'url' ? (
              <input name="imageUrl" type="text" placeholder="https://..." className="w-full border border-gray-300 p-3 rounded-lg" />
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50"><input name="imageFile" type="file" accept="image/*" className="w-full text-sm" /></div>
            )}
          </div>

          <button type="submit" className="bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-all">Simpan Portofolio</button>
        </form>
      </div>
    </div>
  );
}