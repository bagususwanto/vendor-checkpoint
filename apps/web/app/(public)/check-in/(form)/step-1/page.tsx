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
