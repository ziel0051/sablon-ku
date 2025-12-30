'use client';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton = () => {
  // Ganti dengan nomor WA kamu (format: 628xxx)
  const phoneNumber = '628123456789'; 
  const message = 'Halo Admin Sablon Ku, saya mau tanya harga untuk sablon kaos custom.';
  
  const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a 
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 flex items-center gap-2 group"
    >
      <MessageCircle size={28} />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold">
        Chat via WhatsApp
      </span>
    </a>
  );
};