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
          <CardTitle className="text-2xl">Identitas & Perusahaan</CardTitle>
          <CardDescription className="vendor-text">
            Mohon isi data diri, pilih perusahaan, dan pilih kategori material
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VendorIdentityForm />
        </CardContent>
      </Card>
    </div>
  );
}
