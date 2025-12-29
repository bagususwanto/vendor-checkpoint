'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function QueueStatusHeader() {
  const router = useRouter();

  return (
    <header className="top-0 left-0 z-50 fixed bg-background/80 supports-backdrop-filter:bg-background/60 backdrop-blur-xl border-border/40 border-b w-full">
      <div className="flex justify-between items-center mx-auto px-4 py-4 container">
        <Button
          variant="ghost"
          className="gap-2 pl-0 text-muted-foreground hover:text-foreground"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Menu Utama
        </Button>

        <div className="flex items-center gap-2 text-muted-foreground opacity-50">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-medium text-xs">Vendor Checkpoint</span>
        </div>
      </div>
    </header>
  );
}
