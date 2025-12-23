'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import { ArrowLeft, Building2, CircleArrowRight, User } from 'lucide-react';

import { ComboboxVendor } from '@/components/combobox-vendor';
import IconLabel from '@/components/icon-label';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { VendorIdentitySchema } from '@/lib/schemas/vendor-identity.schema';
import { useChecklistStore } from '@/stores/use-checklist.store';
import { VendorInfoCard } from './vendor-info-card';
import { vendorService } from '@/services/vendor.service';

export function VendorIdentityForm() {
  const { step1Data, setStep1Data } = useChecklistStore();
  const router = useRouter();

  const [vendors, setVendors] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Initial Selected Vendor from store
  const [selectedVendor, setSelectedVendor] = useState<{
    label: string;
    value: string;
    category_name: string;
    category_id: number;
    vendorCode: string;
  } | null>(() => {
    if (step1Data?.company.value) {
      return {
        label: step1Data.company.label,
        value: step1Data.company.value,
        category_name: step1Data.company.category_name,
        category_id: step1Data.company.category_id,
        vendorCode: step1Data.company.vendorCode,
      };
    }
    return null;
  });

  const displayVendors = useMemo(() => {
    if (
      selectedVendor &&
      !vendors.find((v) => v.value === selectedVendor.value)
    ) {
      return [selectedVendor, ...vendors];
    }
    return vendors;
  }, [vendors, selectedVendor]);

  const fetchVendors = async (
    currentPage: number,
    searchTerm: string,
    isNewSearch: boolean
  ) => {
    if (!isNewSearch && isLoading) return;

    setIsLoading(true);
    try {
      const data = await vendorService.getVendors({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        isActive: true,
      });

      const newVendors = data.data.map((v) => ({
        label: v.company_name,
        value: String(v.vendor_id),
        category_name: v.vendor_category?.category_name,
        category_id: v.vendor_category_id,
        vendorCode: v.vendor_code,
      }));

      setVendors((prev) =>
        isNewSearch ? newVendors : [...prev, ...newVendors]
      );

      const { total, limit, page: metaPage } = data.meta;
      const totalPages = Math.ceil(total / limit);
      setHasMore(metaPage < totalPages);
    } catch (e) {
      console.error('Failed to fetch vendors', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchVendors(1, debouncedSearch, true);
  }, [debouncedSearch]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchVendors(nextPage, debouncedSearch, false);
    }
  };

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
    const vendor = displayVendors.find((c) => c.value === value);
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
    <>
      <form
        id="vendor-identity-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                    dataOptions={displayVendors}
                    type="perusahaan"
                    onSelect={handleSelectVendor}
                    value={selectedVendor?.value}
                    onSearch={setSearch}
                    onLoadMore={handleLoadMore}
                    isLoading={isLoading}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          {selectedVendor && (
            <VendorInfoCard
              categoryName={selectedVendor.category_name}
              vendorCode={selectedVendor.vendorCode}
            />
          )}
        </FieldGroup>
      </form>

      <CardFooter className="flex flex-row justify-between gap-2 px-0 pt-6">
        <Button
          disabled
          type="button"
          size={'xl'}
          variant="outline"
          className="w-1/2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 w-6 h-6" />
          Kembali
        </Button>
        <Button
          size={'xl'}
          type="submit"
          onClick={form.handleSubmit}
          className="w-1/2"
        >
          Lanjut
          <CircleArrowRight className="ml-2 w-6 h-6" />
        </Button>
      </CardFooter>
    </>
  );
}
