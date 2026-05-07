'use client';

import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { VendorIdentityForm } from './components/vendor-identity-form';
import { useChecklistStore } from '@/stores/use-checklist.store';

export default function CheckInStep1() {
  const { successData, clearChecklistData } = useChecklistStore();

  // Hanya reset store jika ada sisa data dari sesi sebelumnya yang sudah selesai submit.
  // Jika successData ada → berarti ada sesi lama yang completed → harus dibersihkan.
  // Jika user navigasi "Back" ke step-1 di tengah sesi → successData null → data aman, tidak di-reset.
  useEffect(() => {
    if (successData) {
      clearChecklistData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Card className="w-full max-w-4xl">
        <CardHeader className="items-center text-center pb-4 sm:pb-6">
          <CardTitle className="text-xl sm:text-2xl">Identitas & Perusahaan</CardTitle>
          <CardDescription className="vendor-text text-xs sm:text-sm">
            Mohon isi data diri, pilih perusahaan, dan pilih kategori vendor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VendorIdentityForm />
        </CardContent>
      </Card>
    </div>
  );
}
