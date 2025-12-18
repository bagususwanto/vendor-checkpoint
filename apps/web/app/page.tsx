'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { InteractiveBackground } from '@/components/interactive-background';
import {
  CheckCircle2,
  ChevronRight,
  Search,
  ShieldCheck,
  Building2,
  Clock,
  ArrowRight,
  CircleArrowRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ThemeToggleButton } from '@/components/ui/shadcn-io/theme-toggle-button';
import { useTheme } from 'next-themes';

export default function Home() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden">
      {/* Dynamic Background Elements */}
      <InteractiveBackground color="59, 130, 246" />
      <div className="top-0 right-0 -z-10 absolute bg-primary/20 opacity-50 blur-[120px] rounded-full w-[500px] h-[500px]" />
      <div className="bottom-0 left-0 -z-10 absolute bg-purple-500/20 opacity-50 blur-[120px] rounded-full w-[500px] h-[500px]" />

      {/* Header */}
      <header className="top-0 z-50 sticky bg-background/80 supports-backdrop-filter:bg-background/60 backdrop-blur-xl border-border/40 border-b w-full">
        <div className="flex justify-between items-center mx-auto px-4 py-4 container">
          {/* Logo */}
          <div className="group flex items-center gap-3 cursor-default">
            <div className="relative flex justify-center items-center bg-primary/10 group-hover:bg-primary/20 rounded-xl w-10 h-10 transition-colors">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <div className="absolute inset-0 rounded-xl ring-1 ring-primary/20 ring-inset" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-lg tracking-tight">
                Vendor Checkpoint
              </span>
              <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-wider">
                PT. Toyota Motor Manufacturing Indonesia
              </span>
            </div>
          </div>

          {/* Navigation / Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/login')}>
              Staff Portal
            </Button>
            {mounted ? (
              <ThemeToggleButton
                theme={theme === 'light' ? 'light' : 'dark'}
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                variant="circle-blur"
                start="top-right"
              />
            ) : (
              <div className="w-10 h-10" />
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
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

            <div className="slide-in-from-bottom-8 flex sm:flex-row flex-col justify-center items-center gap-4 pt-4 md:pt-8 animate-in duration-1000 ease-out delay-500 fade-in">
              <Button size="xl" onClick={() => router.push('/check-in/step-1')}>
                Mulai Check-In
                <CircleArrowRight className="size-6" />
              </Button>
              <Button
                size="xl"
                variant="outline"
                onClick={() => router.push('/queue-status')}
              >
                <Search className="size-6" />
                Cek Status Antrean
              </Button>
            </div>
          </div>
        </section>

        {/* Features / Steps Grid */}
        <section className="mx-auto px-4 pb-20 container">
          <div className="gap-6 lg:gap-8 grid md:grid-cols-3 mx-auto max-w-6xl">
            {/* Step 1 */}
            <div className="group relative bg-card/30 hover:bg-card/50 hover:shadow-2xl hover:shadow-primary/5 backdrop-blur-sm p-8 border border-border/50 rounded-3xl transition-all hover:-translate-y-1">
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity" />
              <div className="z-10 relative">
                <div className="inline-flex justify-center items-center bg-blue-500/10 mb-6 rounded-2xl w-14 h-14 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="mb-3 font-bold text-2xl tracking-tight">
                  1. Isi Data Vendor
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Lengkapi identitas driver dan informasi perusahaan. Sistem
                  akan memvalidasi data secara otomatis.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative bg-card/30 hover:bg-card/50 hover:shadow-2xl hover:shadow-purple-500/5 backdrop-blur-sm p-8 border border-border/50 rounded-3xl transition-all hover:-translate-y-1">
              <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity" />
              <div className="z-10 relative">
                <div className="inline-flex justify-center items-center bg-purple-500/10 mb-6 rounded-2xl w-14 h-14 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="mb-3 font-bold text-2xl tracking-tight">
                  2. Checklist Safety
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Konfirmasi kepatuhan terhadap standar Safety, Quality,
                  Productivity & Environment (SQPE).
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative bg-card/30 hover:bg-card/50 hover:shadow-2xl hover:shadow-green-500/5 backdrop-blur-sm p-8 border border-border/50 rounded-3xl transition-all hover:-translate-y-1">
              <div className="absolute inset-0 bg-linear-to-br from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity" />
              <div className="z-10 relative">
                <div className="inline-flex justify-center items-center bg-green-500/10 mb-6 rounded-2xl w-14 h-14 text-green-500 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-7 h-7" />
                </div>
                <h3 className="mb-3 font-bold text-2xl tracking-tight">
                  3. Dapatkan Antrean
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Selesai! Sistem akan menerbitkan nomor antrean digital dan
                  estimasi waktu tunggu Anda.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="bg-background/50 backdrop-blur-xl border-border/40 border-t">
        <div className="mx-auto px-4 py-8 container">
          <div className="flex md:flex-row flex-col justify-between items-center gap-4 text-muted-foreground text-sm">
            <p className="font-medium">
              © 2025 DX Warehouse. Vendor Checkpoint System.
            </p>
            <div className="flex items-center gap-6">
              <Button
                variant="link"
                className="px-0 text-muted-foreground hover:text-primary"
                onClick={() => router.push('/display')}
              >
                TV Display Mode
              </Button>
              <div className="bg-border w-px h-4" />
              <span className="flex items-center gap-2">
                <span className="bg-green-500 rounded-full w-2 h-2 animate-pulse" />
                System Online
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
