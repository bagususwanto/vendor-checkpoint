'use client';

import { useState, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { DynamicBreadcrumb } from '@/app/(dashboard)/components/dynamic-breadcrumb';
import { ThemeToggleButton } from '@/components/ui/shadcn-io/theme-toggle-button';
import { useTheme } from 'next-themes';

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b px-4 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <DynamicBreadcrumb />
      </div>

      <div className="flex items-center gap-2">
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
    </header>
  );
}
