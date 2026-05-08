'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { Wifi, Maximize, Minimize, Truck, ShieldCheck } from 'lucide-react';
import { ThemeToggleButton } from '@/components/ui/shadcn-io/theme-toggle-button';
import { Button } from '@/components/ui/button';

export function MonitorHeader() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  const handleThemeToggle = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  if (!currentTime || !mounted) return null;

  return (
    <header className="relative z-10 bg-card border-b border-border px-6 py-3 flex justify-between items-center shrink-0 shadow-sm">
      {/* Left Side - Logo & Title */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur-sm group-hover:bg-primary/30 transition-all duration-500" />
          <div className="relative w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105">
            <Truck className="w-7 h-7 text-primary-foreground" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-foreground uppercase leading-tight">
            Vendor <span className="text-primary italic">Arrival</span> Status
          </h1>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-primary" />
            <p className="text-muted-foreground text-[9px] font-bold tracking-[0.2em] uppercase">
              Toyota Motor Manufacturing Indonesia
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Time & Tools */}
      <div className="flex items-center gap-6">
        {/* Connection Status */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
            Live System
          </span>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border">
          <ThemeToggleButton
            theme={theme === 'dark' ? 'dark' : 'light'}
            onClick={handleThemeToggle}
            variant="circle"
            start="center"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="text-muted-foreground hover:bg-muted rounded-full w-8 h-8"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Time Display */}
        <div className="flex items-center gap-4 pl-6 border-l border-border">
            <div className="text-right tabular-nums">
              <div className="text-2xl font-black text-primary leading-tight">
                {currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
                <span className="text-base text-muted-foreground ml-1">
                  {currentTime
                    .toLocaleTimeString('en-US', {
                      second: '2-digit',
                    })
                    .slice(-2)}
                </span>
              </div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-tight">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long' })}
              </div>
              <div className="text-[10px] font-black text-foreground/70 uppercase tracking-widest leading-tight mt-0.5">
                {currentTime.toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
        </div>
      </div>
    </header>
  );
}
