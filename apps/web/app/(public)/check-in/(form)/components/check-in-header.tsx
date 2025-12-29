'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChecklistStore } from '@/stores/use-checklist.store';
import { CheckInSteps } from './check-in-steps';

interface CheckInHeaderProps {
  onShowExitDialog: () => void;
}

export function CheckInHeader({ onShowExitDialog }: CheckInHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { step1Data, step2Data } = useChecklistStore();

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
    <header className="top-0 z-30 sticky bg-background/95 supports-backdrop-filter:bg-background/60 backdrop-blur border-b">
      <div className="mx-auto px-6 py-2 container">
        {/* Back Button */}
        <div className="mb-2">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="mr-1 w-3 h-3" />
            <span>Kembali</span>
          </Button>
        </div>

        {/* Progress Steps */}
        <CheckInSteps />
      </div>
    </header>
  );
}
