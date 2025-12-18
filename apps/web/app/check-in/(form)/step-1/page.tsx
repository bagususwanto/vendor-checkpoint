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
import { useForm } from '@tanstack/react-form';
import { VendorIdentitySchema } from '@/lib/schemas/vendor-identity.schema';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { useChecklistStore } from '@/stores/use-checklist.store';

const companys = [
  {
    label: 'PT. ABC Indonesia',
    value: '1',
    category_name: 'BBM',
    category_id: 1,
    vendorCode: 'VND-001',
  },
  {
    label: 'PT. XYZ Indonesia',
    value: '2',
    category_name: 'Chemicals',
    category_id: 2,
    vendorCode: 'VND-002',
  },
  {
    label: 'PT. 123 Indonesia',
    value: '3',
    category_name: 'BBM',
    category_id: 1,
    vendorCode: 'VND-003',
  },
];

export default function CheckInStep1() {
  const { step1Data, setStep1Data } = useChecklistStore();
  const router = useRouter();

  const [selectedVendor, setSelectedVendor] = useState<{
    label: string;
    value: string;
    category_name: string;
    category_id: number;
    vendorCode: string;
  } | null>(() => {
    if (step1Data?.company.value) {
      return companys.find((c) => c.value === step1Data.company.value) || null;
    }
    return null;
  });

  const form = useForm({
    defaultValues: {
      fullName: step1Data?.fullName || '',
      company: {
        value: step1Data?.company.value || '',
        label: step1Data?.company.label || '',
        category_name: step1Data?.company.category_name || '',
        category_id: step1Data?.company.category_id || 0,
        vendorCode: step1Data?.company.vendorCode || '',
      },
    },
    validators: {
      onSubmit: VendorIdentitySchema,
    },
    onSubmit: async ({ value }) => {
      setStep1Data(value);
      router.push('/check-in/step-2');
    },
  });

  const handleSelectVendor = (value: string) => {
    const vendor = companys.find((c) => c.value === value);
    setSelectedVendor(vendor || null);
    if (vendor) {
      form.setFieldValue('company.value', vendor.value);
      form.setFieldValue('company.label', vendor.label);
      form.setFieldValue('company.category_name', vendor.category_name);
      form.setFieldValue('company.category_id', vendor.category_id);
      form.setFieldValue('company.vendorCode', vendor.vendorCode);
    }
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
          <form
            id="vendor-identity-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name="fullName"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <IconLabel
                        classNameIcon="w-6 h-6"
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
                        autoComplete="off"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="company.value"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <IconLabel
                        classNameIcon="w-6 h-6"
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
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              {selectedVendor && (
                <Card className="bg-muted/50 border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg">Informasi Lainnya</CardTitle>
                  </CardHeader>
                  <CardContent className="gap-4 grid grid-cols-2">
                    <div className="gap-1 grid">
                      <span className="font-medium text-muted-foreground text-sm">
                        Kategori
                      </span>
                      <span className="font-semibold text-base">
                        {selectedVendor.category_name}
                      </span>
                    </div>
                    <div className="gap-1 grid">
                      <span className="font-medium text-muted-foreground text-sm">
                        Kode Perusahaan
                      </span>
                      <span className="font-semibold text-base">
                        {selectedVendor.vendorCode}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex flex-row justify-between gap-2">
          <Button
            disabled
            type="button"
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
            form="vendor-identity-form"
            className="w-1/2"
          >
            Lanjut
            <CircleArrowRight className="ml-2 size-6" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
