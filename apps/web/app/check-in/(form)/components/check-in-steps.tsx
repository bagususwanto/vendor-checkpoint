'use client';

import { CheckCircle2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function CheckInSteps() {
  const pathname = usePathname();

  const steps = [
    { path: '/check-in/step-1', label: 'Identitas' },
    { path: '/check-in/step-2', label: 'Pemeriksaan' },
    { path: '/check-in/step-3', label: 'Konfirmasi' },
  ];

  const currentStepIndex = steps.findIndex((step) => step.path === pathname);

  return (
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
                  <span className="font-semibold text-xs">{index + 1}</span>
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
  );
}
