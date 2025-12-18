'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useChecklistStore } from '@/stores/use-checklist.store';
import { ReviewIdentity } from './components/review-identity';
import { ReviewChecklist } from './components/review-checklist';
import { ReviewActions } from './components/review-actions';

export default function CheckInStep3() {
  const { step1Data, step2Data, successData } = useChecklistStore();
  const router = useRouter();

  useEffect(() => {
    // If successData exists, it means we just submitted successfully.
    // Redirect to success page immediately to avoid race conditions.
    if (successData) {
      router.replace('/check-in/success');
      return;
    }

    if (!step1Data) {
      router.replace('/check-in/step-1');
      return;
    }

    if (!step2Data) {
      router.replace('/check-in/step-2');
    }
  }, [step1Data, step2Data, successData, router]);

  return (
    <div>
      <Card className="w-full max-w-4xl">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-2xl">Konfirmasi Data</CardTitle>
          <CardDescription className="vendor-text">
            Periksa kembali data Anda sebelum submit.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ReviewIdentity step1Data={step1Data} />
          <ReviewChecklist
            step2Data={step2Data}
            vendorCategory={step1Data?.company.category_name}
          />
        </CardContent>
        <ReviewActions />
      </Card>
    </div>
  );
}
