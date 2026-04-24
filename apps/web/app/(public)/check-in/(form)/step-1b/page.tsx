'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LateReasonForm } from './components/late-reason-form';

export default function CheckInStep1b() {
  return (
    <div>
      <Card className="w-full max-w-4xl">
        <CardHeader className="items-center text-center pb-4 sm:pb-6">
          <CardTitle className="text-xl sm:text-2xl">Alasan Keterlambatan</CardTitle>
          <CardDescription className="vendor-text text-xs sm:text-sm">
            Sistem mendeteksi kedatangan Anda melewati batas waktu jadwal yang
            ditentukan. Mohon pilih alasan keterlambatan Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LateReasonForm />
        </CardContent>
      </Card>
    </div>
  );
}
