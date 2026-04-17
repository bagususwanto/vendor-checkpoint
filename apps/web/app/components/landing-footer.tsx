'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tv, MonitorPlay } from 'lucide-react';

export function LandingFooter() {
  const router = useRouter();

  return (
    <footer className="bg-background/50 backdrop-blur-xl border-border/40 border-t">
      <div className="mx-auto px-4 py-6 container">
        <div className="flex md:flex-row flex-col justify-between items-center gap-4 text-muted-foreground text-sm">
          <p className="font-medium opacity-70">
            © 2025 DX Warehouse. Vendor Checkpoint System. v1.1.20
          </p>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary transition-all gap-2"
              onClick={() => window.open('/display', '_blank')}
            >
              <Tv className="w-4 h-4" />
              <span className="hidden sm:inline">Display</span>
            </Button>
            
            <div className="bg-border w-px h-4" />

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary transition-all gap-2"
              onClick={() => window.open('/monitor', '_blank')}
            >
              <MonitorPlay className="w-4 h-4" />
              <span className="hidden sm:inline">Arrival Monitor</span>
            </Button>

            <div className="bg-border w-px h-4 ml-2" />

            <span className="flex items-center gap-2 px-3">
              <span className="bg-emerald-500 rounded-full w-2 h-2 animate-pulse" />
              <span className="font-bold text-[10px] tracking-wider uppercase opacity-80">System Online</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
