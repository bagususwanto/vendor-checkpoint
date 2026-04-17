'use client';

import { useRouter } from 'next/navigation';
import { CircleArrowRight, Search, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingHero() {
  const router = useRouter();

  return (
    <section className="relative flex flex-col justify-center mx-auto px-4 pt-12 md:pt-24 pb-20 md:pb-32 min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-100px)] container">
      <div className="space-y-6 md:space-y-8 mx-auto max-w-5xl text-center">
        <div className="slide-in-from-bottom-4 animate-in duration-1000 ease-out delay-100 fade-in">
          <span className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full ring-1 ring-primary/20 ring-inset font-medium text-primary text-sm">
            <span className="relative flex w-2 h-2">
              <span className="inline-flex absolute bg-primary opacity-75 rounded-full w-full h-full animate-ping"></span>
              <span className="inline-flex relative bg-primary rounded-full w-2 h-2"></span>
            </span>
            Sistem Check-In Vendor Digital Terintegrasi
          </span>
        </div>

        <h1 className="slide-in-from-bottom-8 font-extrabold text-foreground text-4xl sm:text-6xl md:text-7xl text-balance tracking-tight animate-in duration-1000 ease-out delay-200 fade-in">
          Check-In Lebih Cepat, <br />
          <span className="bg-clip-text bg-linear-to-r from-primary to-purple-600 text-transparent">
            Lebih Efisien
          </span>
        </h1>

        <p className="slide-in-from-bottom-8 mx-auto max-w-2xl text-muted-foreground text-base md:text-xl leading-relaxed animate-in duration-1000 ease-out delay-300 fade-in">
          Platform manajemen kedatangan vendor yang menyederhanakan proses
          registrasi, pengecekan keamanan hingga penerbitan antrean secara
          digital.
        </p>

        <div className="slide-in-from-bottom-8 flex flex-col justify-center items-center gap-8 pt-4 md:pt-8 animate-in duration-1000 ease-out delay-500 fade-in">
          {/* Primary Action */}
          <Button
            size="xl"
            className="h-16 px-10 text-lg shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105"
            onClick={() => router.push('/check-in/step-1')}
          >
            Mulai Check-In
            <CircleArrowRight className="size-6 ml-2" />
          </Button>

          {/* Secondary Actions Group */}
          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <div className="flex items-center gap-4 w-full">
              <div className="flex-1 h-px bg-border/50" />
              <span className="text-muted-foreground text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] whitespace-nowrap opacity-60">
                Layanan Lainnya
              </span>
              <div className="flex-1 h-px bg-border/50" />
            </div>

            <div className="flex sm:flex-row flex-col justify-center items-center gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => router.push('/check-in/departure')}
              >
                <LogOut className="size-4 group-hover:-translate-x-1 transition-transform" />
                Check-Out
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/queue-status')}
              >
                <Search className="size-4" />
                Cek Status Antrean
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
