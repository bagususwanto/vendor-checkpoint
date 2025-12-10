'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { InteractiveBackground } from '@/components/interactive-background';
import { CheckCircle2, CircleArrowRight, Search, Shield } from 'lucide-react';
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
    <div className="relative min-h-screen">
      <InteractiveBackground color="59, 130, 246" />
      {/* Header */}
      <header className="top-0 z-50 sticky bg-background/95 supports-backdrop-filter:bg-background/60 backdrop-blur border-b">
        <div className="flex justify-between items-center mx-auto px-4 py-4 container">
          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center bg-primary rounded-lg w-10 h-10">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-xl">Vendor Checkpoint</h1>
              <p className="text-muted-foreground text-xs">
                PT. Toyota Motor Manufacturing Indonesia
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push('/login')}>
              Login Staff
            </Button>
            {mounted ? (
              <ThemeToggleButton
                theme={theme === 'light' ? 'light' : 'dark'}
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                variant="circle" // circle | circle-blur | gif | polygon
                start="center" // origin animasi
              />
            ) : (
              <div className="w-10 h-10" />
            )}
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="mx-auto px-4 py-20 md:py-32 container">
        <div className="space-y-8 mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 mb-4 px-4 py-2 rounded-full font-medium text-primary text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Sistem Check-In Vendor Digital
          </div>

          <h2 className="bg-clip-text bg-linear-to-br from-foreground to-foreground/70 font-bold text-transparent text-5xl md:text-7xl tracking-tight">
            Check-In Vendor
            <br />
            <span className="text-primary">Lebih Efisien</span>
          </h2>

          <p className="mx-auto max-w-2xl text-muted-foreground text-xl md:text-2xl">
            Proses check-in diproses secara otomatis. Sistem langsung
            menghasilkan nomor antrean.
          </p>

          <div className="flex sm:flex-row flex-col justify-center gap-4 pt-8">
            <Button size="xl" onClick={() => router.push('/check-in/step-1')}>
              Mulai Check-In
              <CircleArrowRight className="size-6" />
            </Button>
            <Button
              size="xl"
              variant="outline"
              onClick={() => router.push('/status')}
            >
              <Search className="size-6" />
              Cek Status Antrean
            </Button>
          </div>
        </div>
      </section>
      {/* Steps */}
      <section className="mx-auto px-4 py-20 container">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h3 className="mb-4 font-bold text-4xl">3 Langkah Mudah</h3>
            <p className="text-muted-foreground text-lg">
              Proses check-in selesai dalam hitungan menit
            </p>
          </div>

          <div className="gap-8 grid md:grid-cols-3">
            <Card className="hover:shadow-lg p-8 transition-shadow">
              <div className="flex justify-center items-center bg-primary/10 mb-6 rounded-2xl w-14 h-14 font-bold text-primary text-2xl">
                1
              </div>
              <h4 className="mb-3 font-semibold text-2xl">Isi Data</h4>
              <p className="text-muted-foreground leading-relaxed">
                Input identitas driver dan informasi perusahaan vendor
              </p>
            </Card>

            <Card className="hover:shadow-lg p-8 transition-shadow">
              <div className="flex justify-center items-center bg-primary/10 mb-6 rounded-2xl w-14 h-14 font-bold text-primary text-2xl">
                2
              </div>
              <h4 className="mb-3 font-semibold text-2xl">Checklist</h4>
              <p className="text-muted-foreground leading-relaxed">
                Lengkapi checklist Safety, Quality, Productivity & Environment
              </p>
            </Card>

            <Card className="hover:shadow-lg p-8 transition-shadow">
              <div className="flex justify-center items-center bg-primary/10 mb-6 rounded-2xl w-14 h-14 font-bold text-primary text-2xl">
                3
              </div>
              <h4 className="mb-3 font-semibold text-2xl">Selesai</h4>
              <p className="text-muted-foreground leading-relaxed">
                Sistem menghasilkan nomor antrean dan menunggu proses
                verifikasi.
              </p>
            </Card>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="mt-16 px-4 py-8 border-t w-full">
        <div className="flex md:flex-row flex-col justify-between items-center gap-4 mx-auto container">
          <p className="text-muted-foreground text-sm">
            © 2025 DX Warehouse. Vendor Checkpoint.
          </p>
          <Button variant="link" onClick={() => router.push('/display')}>
            TV Display Mode
          </Button>
        </div>
      </footer>
    </div>
  );
}
