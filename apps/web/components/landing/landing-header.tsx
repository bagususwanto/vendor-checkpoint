'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggleButton } from '@/components/ui/shadcn-io/theme-toggle-button';

export function LandingHeader() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
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
  );
}
