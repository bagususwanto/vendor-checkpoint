'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggleButton } from '@/components/ui/shadcn-io/theme-toggle-button';
import { useChecklistStore } from '@/stores/use-checklist.store';
import { CheckInSteps } from './check-in-steps';

interface CheckInHeaderProps {
  onShowExitDialog: () => void;
}

export function CheckInHeader({ onShowExitDialog }: CheckInHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { step1Data, step2Data } = useChecklistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBack = () => {
    // If on Step 1, verify if we have any data before going back (which typically goes to home)
    if (pathname === '/check-in/step-1') {
      if (step1Data || step2Data) {
        onShowExitDialog();
      } else {
        router.push('/');
      }
    } else {
      router.back();
    }
  };

  return (
    <>
      {/* Fixed Back Button */}
      <div className="top-4 left-4 z-50 fixed">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="bg-background/50 backdrop-blur-sm hover:bg-background/80"
        >
          <ArrowLeft className="mr-1 w-4 h-4" />
          <span>{pathname === '/check-in/step-1' ? 'Kembali' : 'Kembali'}</span>
        </Button>
      </div>

      {/* Fixed Theme Toggle */}
      <div className="top-4 right-4 z-50 fixed">
        {mounted ? (
          <ThemeToggleButton
            theme={theme === 'light' ? 'light' : 'dark'}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            variant="circle-blur"
            start="top-right"
            className="bg-background/50 backdrop-blur-sm hover:bg-background/80"
          />
        ) : (
          <div className="w-10 h-10" />
        )}
      </div>

      {/* Header Container primarily for Steps and Background */}
      <header className="top-0 z-30 sticky bg-background/95 supports-backdrop-filter:bg-background/60 backdrop-blur border-b">
        <div className="mx-auto px-6 py-4 container">
          {/* Progress Steps - Centered */}
          <div className="flex justify-center w-full">
            <div className="w-full max-w-4xl">
              <CheckInSteps />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
