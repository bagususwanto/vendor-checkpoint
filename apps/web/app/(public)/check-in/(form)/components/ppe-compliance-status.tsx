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
      <Alert
        className={`${
          isCompliant
            ? 'border-status-success-border bg-status-success-bg [&>svg]:text-status-success-fg'
            : 'border-status-error-border bg-status-error-bg [&>svg]:text-status-error-fg'
        } grid-cols-[auto_1fr] items-start gap-x-4`}
      >
        {isCompliant ? (
          <CheckCircle2 className="h-6 w-6 mt-1" />
        ) : (
          <XCircle className="h-6 w-6 mt-1" />
        )}
        <AlertTitle className="text-lg font-bold mb-1 line-clamp-none">
          {isCompliant
            ? 'Kepatuhan PPE Terpenuhi'
            : 'Kepatuhan PPE Belum Terpenuhi'}
        </AlertTitle>
        <AlertDescription className="text-base text-muted-foreground">
          {isCompliant
            ? 'Anda sudah memakai perlengkapan keselamatan yang diperlukan.'
            : 'Mohon periksa kembali perlengkapan keselamatan Anda.'}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Hardhat Item */}
        <div className="flex items-center justify-between p-4 rounded-lg border bg-card shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-full">
              <Shield className="h-5 w-5 text-muted-foreground" />
            </div>
            <span className="font-medium">Helm (Hardhat)</span>
          </div>
          {hasHardhat ? (
            <div className="flex items-center text-status-success-fg bg-status-success-bg px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              Terdeteksi
            </div>
          ) : (
            <div className="flex items-center text-status-error-fg bg-status-error-bg px-3 py-1 rounded-full text-sm font-medium">
              <XCircle className="h-4 w-4 mr-1.5" />
              Missing
            </div>
          )}
        </div>

        {/* Safety Vest Item */}
        <div className="flex items-center justify-between p-4 rounded-lg border bg-card shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-full">
              <Shield className="h-5 w-5 text-muted-foreground" />
            </div>
            <span className="font-medium">Rompi (Vest)</span>
          </div>
          {hasSafetyVest ? (
            <div className="flex items-center text-status-success-fg bg-status-success-bg px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              Terdeteksi
            </div>
          ) : (
            <div className="flex items-center text-status-error-fg bg-status-error-bg px-3 py-1 rounded-full text-sm font-medium">
              <XCircle className="h-4 w-4 mr-1.5" />
              Missing
            </div>
          )}
        </div>
      </div>

      {!isCompliant && missingItems.length > 0 && (
        <div className="rounded-lg bg-status-error-bg p-4 border border-status-error-border">
          <p className="text-sm font-medium text-status-error-fg mb-2">
            Rekomendasi Tindakan:
          </p>
          <ul className="list-disc list-inside text-sm text-status-error-fg space-y-1 ml-1">
            {missingItems.map((item, idx) => (
              <li key={idx}>
                Mohon gunakan <strong>{item}</strong> dengan benar agar terlihat
                kamera.
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
