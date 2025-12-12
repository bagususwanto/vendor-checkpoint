'use client';

import { usePathname, useRouter } from 'next/navigation';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="flex flex-col bg-linear-to-br from-background to-muted/20 min-h-screen">
      <header className="top-0 z-50 sticky bg-background/95 supports-backdrop-filter:bg-background/60 backdrop-blur border-b">
        <div className="mx-auto px-6 py-5 container">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
            size={'lg'}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Button>

          {/* Progress Steps */}
          <div className="flex justify-between items-center mb-6">
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
                        flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 
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
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="font-semibold text-sm">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {/* Step Label */}
                    <span
                      className={`
                        mt-2 vendor-text font-medium text-center transition-colors duration-300
                        ${isActive ? 'text-primary' : 'text-foreground/70'}
                      `}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-2 mt-5 h-0.5">
                      <div
                        className={`
                          h-full transition-all duration-500 rounded-full
                          ${isCompleted ? 'bg-primary' : 'bg-foreground/20'}
                        `}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          {/* <div className="space-y-2">
            <div className="flex justify-between items-center vendor-text">
              <span className="font-medium">Progress Pengisian</span>
              <span className="font-semibold text-primary">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="relative bg-foreground/20 rounded-full h-2 overflow-hidden">
              <div
                className="left-0 absolute inset-y-0 bg-linear-to-r from-primary to-accent shadow-lg rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-foreground/20 animate-pulse" />
              </div>
            </div>
          </div> */}
        </div>
      </header>

      <main className="flex-1 mx-auto px-6 py-8 w-full max-w-4xl">
        <div className="slide-in-from-bottom-4 animate-in duration-500 fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
