'use client';

import { Bell, FileCheck, Clock } from 'lucide-react';

interface DisplayFooterQueueProps {
  message?: string;
}

export function DisplayFooterQueue({ 
  message = "Selamat datang di Vendor Checkpoint  •  Mohon menunggu nomor antrean Anda dipanggil  •  Pastikan dokumen Anda sudah lengkap  •  Siapkan ID Card dan Surat Jalan  •  Hubungi petugas jika memerlukan bantuan" 
}: DisplayFooterQueueProps) {
  return (
    <footer className="relative bg-primary h-14 shrink-0 overflow-hidden">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M20%2020.5V18H0v-2h20v-2.5L25%2018l-5%202.5z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
      
      {/* Left Info Box */}
      <div className="absolute left-0 top-0 bottom-0 flex items-center gap-6 px-6 bg-black/20 border-r border-primary-foreground/10 z-10">
        <div className="flex items-center gap-2 text-primary-foreground">
          <Bell className="w-5 h-5" />
          <span className="font-medium text-sm whitespace-nowrap">INFO PENTING</span>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="absolute left-48 right-48 top-0 bottom-0 flex items-center overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          <span className="flex items-center gap-4 text-lg font-medium text-primary-foreground tracking-wide px-8">
            <FileCheck className="w-5 h-5 text-primary-foreground/70 shrink-0" />
            {message}
          </span>
          <span className="flex items-center gap-4 text-lg font-medium text-primary-foreground tracking-wide px-8">
            <FileCheck className="w-5 h-5 text-primary-foreground/70 shrink-0" />
            {message}
          </span>
        </div>
      </div>

      {/* Right Time Box */}
      <div className="absolute right-0 top-0 bottom-0 flex items-center gap-2 px-6 bg-black/20 border-l border-primary-foreground/10 z-10">
        <Clock className="w-5 h-5 text-primary-foreground/70" />
        <span className="font-medium text-primary-foreground text-sm whitespace-nowrap">Vendor Checkpoint</span>
      </div>

      {/* Marquee Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </footer>
  );
}
