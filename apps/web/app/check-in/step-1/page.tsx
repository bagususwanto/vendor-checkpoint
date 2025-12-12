'use client';

import { useState } from 'react';

import { ComboboxVendor } from '@/components/combobox-vendor';
import IconLabel from '@/components/icon-label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Building2, CircleArrowRight, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckInStep1() {
  const router = useRouter();

  const [selectedVendor, setSelectedVendor] = useState<{
    label: string;
    value: string;
    category: string;
    vendorCode: string;
  } | null>(null);

  const companys = [
    {
      label: 'PT. ABC Indonesia',
      value: '1',
      category: 'BBM',
      vendorCode: 'VND-001',
    },
    {
      label: 'PT. XYZ Indonesia',
      value: '2',
      category: 'Chemicals',
      vendorCode: 'VND-002',
    },
    {
      label: 'PT. 123 Indonesia',
      value: '3',
      category: 'BBM',
      vendorCode: 'VND-003',
    },
  ];

  const handleSelectVendor = (value: string) => {
    const vendor = companys.find((c) => c.value === value);
    setSelectedVendor(vendor || null);
  };

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
          <form>
            <div className="flex flex-col gap-6">
              <div className="gap-2 grid">
                <IconLabel
                  className="vendor-text"
                  classNameIcon="w-8 h-8"
                  htmlFor="fullName"
                  icon={User}
                  required
                >
                  Nama Lengkap
                </IconLabel>
                <Input
                  className="h-12 vendor-text"
                  id="fullName"
                  type="text"
                  placeholder="misal: Budi Santoso"
                  required
                />
              </div>
              <div className="gap-2 grid">
                <IconLabel
                  className="vendor-text"
                  classNameIcon="w-8 h-8"
                  htmlFor="company"
                  icon={Building2}
                  required
                >
                  Perusahaan
                </IconLabel>
                <ComboboxVendor
                  dataOptions={companys}
                  type="perusahaan"
                  onSelect={handleSelectVendor}
                  value={selectedVendor?.value}
                />
              </div>
              {selectedVendor && (
                <Card className="bg-muted/50 border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg">Informasi Vendor</CardTitle>
                  </CardHeader>
                  <CardContent className="gap-4 grid grid-cols-2">
                    <div className="gap-1 grid">
                      <span className="font-medium text-muted-foreground text-sm">
                        Kategori Vendor
                      </span>
                      <span className="font-semibold text-base">
                        {selectedVendor.category}
                      </span>
                    </div>
                    <div className="gap-1 grid">
                      <span className="font-medium text-muted-foreground text-sm">
                        Kode Vendor
                      </span>
                      <span className="font-semibold text-base">
                        {selectedVendor.vendorCode}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-row justify-between gap-2">
          <Button
            disabled
            size={'xl'}
            variant="outline"
            className="w-1/2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 size-6" />
            Kembali
          </Button>
          <Button
            size={'xl'}
            type="submit"
            className="w-1/2"
            onClick={() => router.push('/check-in/step-2')}
          >
            Lanjut
            <CircleArrowRight className="ml-2 size-6" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
