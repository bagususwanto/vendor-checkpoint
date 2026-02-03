'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggleButton } from '@/components/ui/shadcn-io/theme-toggle-button';

export function LoginHeader() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex w-full items-center justify-between p-4 z-20 relative">
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground"
        onClick={() => router.push('/')}
      >
        <ArrowLeft className="mr-2 size-4" />
        Kembali ke halaman utama
      </Button>

      <ThemeToggleButton
        theme={theme as 'light' | 'dark'}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
    </div>
  );
}
