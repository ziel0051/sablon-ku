'use client';

import { Trash2 } from 'lucide-react';

interface DeleteButtonProps {
  id: string;
  action: (formData: FormData) => Promise<void>; // Tipe untuk Server Action
}

export const DeleteButton = ({ id, action }: DeleteButtonProps) => {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        // Ini logic konfirmasinya
        if (!confirm('Apakah Anda yakin ingin menghapus item ini? Data yang dihapus tidak bisa dikembalikan.')) {
          e.preventDefault(); // Batalkan submit jika user klik Cancel
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-md transition"
        title="Hapus Permanen"
      >
        <Trash2 size={18} />
      </button>
    </form>
  );
};