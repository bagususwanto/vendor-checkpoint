'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
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
    </div>
  );
}
