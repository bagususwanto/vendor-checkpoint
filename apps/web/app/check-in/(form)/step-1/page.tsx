'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { VendorIdentityForm } from './components/vendor-identity-form';

export default function CheckInStep1() {
  return (
    <div>
      <Card className="w-full max-w-4xl">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-2xl">Identitas</CardTitle>
          <CardDescription className="vendor-text">
            Mohon isi data diri dan pilih perusahaan Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VendorIdentityForm />
        </CardContent>
      </Card>
    </div>
  );
}
