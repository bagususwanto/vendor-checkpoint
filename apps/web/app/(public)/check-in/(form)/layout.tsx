'use client';

import { useState, useEffect } from 'react';
import { InteractiveBackground } from '@/components/interactive-background';
import { CheckInHeader } from './components/check-in-header';
import { CheckInExitDialog } from './components/check-in-exit-dialog';

export default function CheckInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen">
      <InteractiveBackground color="59, 130, 246" />
      <div className="z-10 relative flex flex-col min-h-screen">
        <CheckInHeader onShowExitDialog={() => setShowExitDialog(true)} />

        <main className="flex-1 mx-auto px-6 py-8 w-full max-w-4xl">
          <div className="slide-in-from-bottom-4 animate-in duration-500 fade-in">
            {children}
          </div>
        </main>
      </div>

      <CheckInExitDialog
        open={showExitDialog}
        onOpenChange={setShowExitDialog}
      />
    </div>
  );
}
