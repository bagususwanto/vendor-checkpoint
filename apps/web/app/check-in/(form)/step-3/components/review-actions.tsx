'use client';

import { useRouter } from 'next/navigation';
import { SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { useChecklistStore } from '@/stores/use-checklist.store';
import { transformCheckinData } from '@/lib/utils/transform-checkin-data';

export function ReviewActions() {
  const router = useRouter();

  const handleSubmit = () => {
    const { step1Data, step2Data, setSuccessData, resetFormData } =
      useChecklistStore.getState();
    const payload = transformCheckinData(step1Data, step2Data);

    if (payload) {
      // Mock success response
      const mockSuccessData = {
        queueNumber: `A-${Math.floor(Math.random() * 900) + 100}`,
        companyName: step1Data?.company.label || '-',
        driverName: step1Data?.fullName || '-',
        status: 'Menunggu',
        submitTime: new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setSuccessData(mockSuccessData);
      router.push('/check-in/success');
      resetFormData();
    } else {
      alert('Gagal memproses data. Pastikan semua data terisi dengan benar.');
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
