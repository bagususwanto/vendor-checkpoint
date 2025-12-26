'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { Wifi, Maximize, Minimize, ShieldCheck } from 'lucide-react';
import { ThemeToggleButton } from '@/components/ui/shadcn-io/theme-toggle-button';

export function DisplayHeaderQueue() {
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

    // Listen for fullscreen changes
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
    <header className="relative bg-card/50 backdrop-blur-xl border-b border-border px-6 py-4 flex justify-between items-center shrink-0">
      {/* Left Side - Logo & Title */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
          <ShieldCheck className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">
            Antrean Vendor
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            PT. Toyota Motor Manufacturing Indonesia
          </p>
        </div>
      </div>

      {/* Right Side - Time & Status */}
      <div className="flex items-center gap-4">
        {/* Connection Status */}
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
          <Wifi className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium text-emerald-500">Live</span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggleButton
          theme={theme === 'dark' ? 'dark' : 'light'}
          onClick={handleThemeToggle}
          variant="circle"
          start="center"
        />

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 border border-border rounded-full transition-colors"
          title={isFullscreen ? 'Keluar Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4 text-foreground" />
          ) : (
            <Maximize className="w-4 h-4 text-foreground" />
          )}
          <span className="text-sm font-medium text-foreground">
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </span>
        </button>

        {/* Time Display */}
        <div className="text-right">
          <div className="text-5xl font-mono font-bold text-foreground tabular-nums tracking-tight">
            {currentTime.toLocaleTimeString('id-ID', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
            })}
            <span className="text-2xl text-muted-foreground ml-1">
              {currentTime.toLocaleTimeString('id-ID', {
                second: '2-digit',
              }).slice(-2)}
            </span>
          </div>
          <div className="text-muted-foreground font-medium text-sm capitalize">
            {currentTime.toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
