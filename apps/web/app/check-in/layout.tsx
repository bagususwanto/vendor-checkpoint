'use client';

import { usePathname, useRouter } from 'next/navigation';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InteractiveBackground } from '@/components/interactive-background';

export default function CheckInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const steps = [
    { path: '/check-in/step-1', label: 'Identitas' },
    { path: '/check-in/step-2', label: 'Pemeriksaan' },
    { path: '/check-in/step-3', label: 'Konfirmasi' },
  ];

  const currentStepIndex = steps.findIndex((step) => step.path === pathname);
  const progressPercent =
    currentStepIndex >= 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  return (
    <div className="relative flex flex-col bg-linear-to-br from-background to-muted/20 min-h-screen">
      <InteractiveBackground color="59, 130, 246" />
      <div className="z-10 relative flex flex-col min-h-screen">
        <header className="top-0 z-30 sticky bg-background/95 supports-backdrop-filter:bg-background/60 backdrop-blur border-b">
          <div className="mx-auto px-6 py-2 container">
            {/* Back Button */}
            {/* Back Button */}
            <div className="mb-2">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="px-2 h-8 text-xs"
                size={'sm'}
              >
                <ArrowLeft className="mr-1 w-3 h-3" />
                <span>Kembali</span>
              </Button>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-1">
              {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;

                return (
                  <div
                    key={step.path}
                    className={`flex items-start ${
                      index === steps.length - 1 ? '' : 'flex-1'
                    }`}
                  >
                    {/* Step Circle */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`
                        flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 
                        ${
                          isCompleted
                            ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/30'
                            : isActive
                              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                              : 'bg-muted text-muted-foreground'
                        }
                      `}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="font-semibold text-xs text-xs">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      {/* Step Label */}
                      <span
                        className={`
                        mt-1 vendor-text font-medium text-xs text-center transition-colors duration-300
                        ${isActive ? 'text-primary' : 'text-foreground/70'}
                      `}
                      >
                        {step.label}
                      </span>
                    </div>

                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div className="flex-1 mx-2 mt-3 h-0.5">
                        <div
                          className={`
                          h-full transition-all duration-500 rounded-full
                          ${isCompleted ? 'bg-primary' : 'bg-accent'}
                        `}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </header>

        <main className="flex-1 mx-auto px-6 py-8 w-full max-w-4xl">
          <div className="slide-in-from-bottom-4 animate-in duration-500 fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
