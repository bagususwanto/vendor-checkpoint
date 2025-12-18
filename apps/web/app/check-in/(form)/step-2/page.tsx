'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useChecklistStore } from '@/stores/use-checklist.store';
import { ChecklistForm } from './components/checklist-form';

export default function CheckInStep2() {
  const router = useRouter();
  const { step1Data } = useChecklistStore();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!step1Data) {
      router.replace('/check-in/step-1');
    }
  }, [step1Data, router]);

  return (
    <div>
      <Card className="w-full max-w-4xl">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-2xl">Daftar Pemeriksaan</CardTitle>
          <CardDescription className="vendor-text">
            Jawab beberapa pertanyaan berikut sebelum memasuki area warehouse.
          </CardDescription>
        </CardHeader>
        <ChecklistForm />
      </Card>
    </div>
  );
}
