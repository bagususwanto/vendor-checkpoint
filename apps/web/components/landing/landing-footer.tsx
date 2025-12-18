'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function LandingFooter() {
  const router = useRouter();

  return (
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
  );
}
