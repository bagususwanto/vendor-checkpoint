'use client';

import { Info } from 'lucide-react';

type PPEScanInstructionsProps = {
  hasScanned?: boolean;
};

export function PPEScanInstructions({
  hasScanned = false,
}: PPEScanInstructionsProps) {
  if (hasScanned) return null;

  return (
    <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
      <div className="flex gap-3">
        <Info className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
        <div className="space-y-2">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100">
            Instruksi Scan PPE
          </h4>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li>
              ✓ Pastikan Anda sudah memakai <strong>Helm Keselamatan</strong>{' '}
              dan <strong>Rompi Keselamatan</strong>
            </li>
            <li>
              ✓ Posisikan diri Anda di depan kamera dengan pencahayaan yang
              cukup
            </li>
            <li>✓ Pastikan helm dan rompi terlihat jelas di kamera</li>
            <li>✓ Klik tombol "Ambil Gambar & Scan" untuk memulai deteksi</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
