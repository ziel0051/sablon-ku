'use client';
import { updatePortfolio } from '@/app/actions';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditPortfolioForm({ item }: { item: any }) {
  const [inputType, setInputType] = useState<'url' | 'upload'>('url');

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-xl text-gray-900">
        <Link href="/admin" className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 text-sm font-bold">
            <ArrowLeft size={16} /> Batal & Kembali
        </Link>
        <h1 className="text-2xl font-bold mb-6">Edit Portofolio</h1>

        <form action={updatePortfolio} className="flex flex-col gap-6">
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="oldImage" value={item.image} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Project</label>
            <input name="title" type="text" defaultValue={item.title} className="w-full border p-3 rounded-lg" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select name="category" defaultValue={item.category} className="w-full border p-3 rounded-lg bg-white" required>
                <option value="Event">Event</option>
                <option value="Komunitas">Komunitas</option>
                <option value="Corporate">Corporate / Kantor</option>
                <option value="Satuan">Satuan / Personal</option>
                <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ganti Foto (Opsional)</label>
            <input type="hidden" name="imageType" value={inputType} />
            <div className="flex gap-4 mb-3">
               <button type="button" onClick={() => setInputType('url')} className={`px-4 py-2 rounded-full text-sm font-medium ${inputType === 'url' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>Link URL</button>
               <button type="button" onClick={() => setInputType('upload')} className={`px-4 py-2 rounded-full text-sm font-medium ${inputType === 'upload' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>Upload File</button>
            </div>
            {inputType === 'url' ? (
               <input name="imageUrl" type="text" placeholder="Kosongkan jika tidak ganti" className="w-full border p-3 rounded-lg" />
            ) : (
               <input name="imageFile" type="file" accept="image/*" className="w-full border p-2 rounded" />
            )}
          </div>

          <button type="submit" className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700">Simpan Perubahan</button>
        </form>
    </div>
  );
}