'use client';

import { useRouter } from 'next/navigation';
import { SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { useChecklistStore } from '@/stores/use-checklist.store';
import { checkInService } from '@/services/check-in.service';
import { toast } from 'sonner';

export function ReviewActions() {
  const router = useRouter();

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
      checklist_responses: Object.entries(step2Data.checklistItems).map(
        ([itemId, value]) => ({
          checklist_item_id: Number(itemId),
          response_value: value === 'true',
        }),
      ),
    };

    try {
      const result = await checkInService.submitCheckIn(payload);

      const mockSuccessData = {
        queueNumber: result.data?.queue_number,
        companyName: result.data?.company_name,
        driverName: result.data?.driver_name,
        status: result.data?.current_status,
        submitTime: result.data?.submission_time,
      };

      setSuccessData(mockSuccessData);
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
    }
  };

  return (
    <CardFooter>
      <Button
        size={'xl'}
        type="button"
        className="w-full"
        onClick={handleSubmit}
      >
        Submit
        <SendHorizonal className="ml-2 size-6" />
      </Button>
    </CardFooter>
  );
}
