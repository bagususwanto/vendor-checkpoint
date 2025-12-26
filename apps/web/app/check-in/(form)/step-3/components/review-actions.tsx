'use client';

import { useRouter } from 'next/navigation';
import { SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { useChecklistStore } from '@/stores/use-checklist.store';
import { checkInService } from '@/services/check-in.service';
import { toast } from 'sonner';

import { formatDate } from '@/lib/utils';
import { useState } from 'react';

export function ReviewActions() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const { step1Data, step2Data, setSuccessData, resetFormData } =
      useChecklistStore.getState();

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

    try {
      setIsSubmitting(true);
      const result = await checkInService.submitCheckIn(payload);

      const successData = {
        queueNumber: result.queue_number,
        companyName: result.company_name,
        driverName: result.driver_name,
        status_display_text: result.status_display_text,
        estimatedWaitMinutes: result.estimated_wait_minutes,
        submitTime: formatDate(result.submission_time),
      };

      setSuccessData(successData);
      toast.success('Check-in Berhasil', {
        description: 'Data Anda telah berhasil dikirim.',
      });
      router.push('/check-in/success');
      resetFormData();
    } catch (error) {
      console.error('Error submitting check-in:', error);
      toast.error('Gagal mengirim data', {
        description: 'Terjadi kesalahan saat mengirim data. Silakan coba lagi.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CardFooter>
      <Button
        size={'xl'}
        type="button"
        className="w-full"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Mengirim...' : 'Submit'}
        <SendHorizonal className="ml-2 size-6" />
      </Button>
    </CardFooter>
  );
}
