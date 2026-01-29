'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useChecklistStore } from '@/stores/use-checklist.store';
import { useSubmitCheckIn } from '@/hooks/api/use-check-in';
import { formatDateTime } from '@/lib/utils';
import { ReviewIdentity } from './components/review-identity';
import { ReviewChecklist } from './components/review-checklist';
import { ReviewActions } from './components/review-actions';
import { ProcessingCheckIn } from './components/processing-check-in';

export default function CheckInStep3() {
  const {
    step1Data,
    step2Data,
    successData,
    checklistCategories,
    setSuccessData,
    resetFormData,
  } = useChecklistStore();
  const router = useRouter();
  const { mutateAsync: submitCheckIn } = useSubmitCheckIn();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // If successData exists, it means we just submitted successfully.
    // Redirect to success page immediately to avoid race conditions.
    if (successData) {
      router.replace('/check-in/success');
      return;
    }

    if (!step1Data || !checklistCategories) {
      router.replace('/check-in/step-1');
      return;
    }

    if (!step2Data) {
      router.replace('/check-in/step-2');
    }
  }, [step1Data, step2Data, successData, router, checklistCategories]);

  const handleSubmit = async () => {
    if (!step1Data || !step2Data) {
      toast.error('Data tidak lengkap', {
        description: 'Silakan kembali ke langkah sebelumnya.',
      });
      return;
    }

    const payload = {
      vendor_id: Number(step1Data.company.value),
      driver_name: step1Data.fullName,
      material_category_id: Number(step1Data.materialCategory.value),
      checklist_responses: Object.entries(step2Data.checklistItems).map(
        ([itemId, value]) => ({
          checklist_item_id: Number(itemId),
          response_value: value === 'true',
        }),
      ),
    };

    setIsProcessing(true);

    try {
      // Artificial minimum delay for better UX (optional, but good for "processing" feel)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const result = await submitCheckIn(payload);

      const successData = {
        queueNumber: result.queue_number,
        companyName: result.company_name,
        driverName: result.driver_name,
        status_display_text: result.status_display_text,
        estimatedWaitMinutes: result.estimated_wait_minutes,
        submitTime: formatDateTime(result.submission_time),
      };

      setSuccessData(successData);
      toast.success('Check-in Berhasil', {
        description: 'Data Anda telah berhasil dikirim.',
      });
      resetFormData();
      router.replace('/check-in/success');
    } catch (error) {
      console.error('Error submitting check-in:', error);
      toast.error('Gagal mengirim data', {
        description: 'Terjadi kesalahan saat mengirim data. Silakan coba lagi.',
      });
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return <ProcessingCheckIn />;
  }

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
          <ReviewChecklist step2Data={step2Data} />
        </CardContent>
        <ReviewActions onConfirm={handleSubmit} isSubmitting={isProcessing} />
      </Card>
    </div>
  );
}
