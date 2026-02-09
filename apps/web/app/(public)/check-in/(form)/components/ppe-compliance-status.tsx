'use client';

import { CheckCircle2, XCircle, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type PPEComplianceStatusProps = {
  isCompliant: boolean;
  hasHardhat: boolean;
  hasSafetyVest: boolean;
  missingItems: string[];
};

export function PPEComplianceStatus({
  isCompliant,
  hasHardhat,
  hasSafetyVest,
  missingItems,
}: PPEComplianceStatusProps) {
  return (
    <div className="space-y-4">
      <Alert variant={isCompliant ? 'default' : 'destructive'}>
        {isCompliant ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <XCircle className="h-5 w-5" />
        )}
        <AlertTitle className="vendor-text">
          {isCompliant
            ? 'Kepatuhan PPE Terpenuhi ✓'
            : 'Kepatuhan PPE Belum Terpenuhi'}
        </AlertTitle>
        <AlertDescription className="vendor-text">
          {isCompliant
            ? 'Anda sudah memakai perlengkapan keselamatan yang diperlukan.'
            : 'Mohon periksa kembali perlengkapan keselamatan Anda.'}
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <h4 className="font-semibold vendor-text flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Checklist PPE:
        </h4>
        <div className="space-y-2 pl-6">
          <div className="flex items-center gap-2 vendor-text">
            {hasHardhat ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <span
              className={
                hasHardhat
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-red-700 dark:text-red-400'
              }
            >
              Helm Keselamatan (Hardhat)
            </span>
          </div>
          <div className="flex items-center gap-2 vendor-text">
            {hasSafetyVest ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <span
              className={
                hasSafetyVest
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-red-700 dark:text-red-400'
              }
            >
              Rompi Keselamatan (Safety Vest)
            </span>
          </div>
        </div>
      </div>

      {!isCompliant && missingItems.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription className="vendor-text">
            <strong>Perlengkapan yang belum terdeteksi:</strong>
            <ul className="mt-2 list-inside list-disc">
              {missingItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
