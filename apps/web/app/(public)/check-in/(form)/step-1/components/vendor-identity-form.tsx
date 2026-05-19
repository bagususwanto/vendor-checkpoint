'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Building2,
  CircleArrowRight,
  User,
  Box,
  AlertCircle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { ComboboxVendor } from '@/components/combobox-vendor';
import IconLabel from '@/components/icon-label';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { VendorIdentitySchema } from '@/lib/schemas/vendor-identity.schema';
import { useChecklistStore } from '@/stores/use-checklist.store';
import { fetchChecklistByCategory } from '@/hooks/api/use-checklist';
import { DropdownVendorCategory } from '@/components/dropdown-vendor-category';
import { useVendors } from '@/hooks/api/use-vendors';
import { useInfiniteVendorCategories } from '@/hooks/api/use-vendor-categories';
import { useArrivalCheck } from '@/hooks/api/use-check-in';
import { cn } from '@/lib/utils';
import { ArrivalCheckResponse } from '@repo/types';

export function VendorIdentityForm() {
  const { step1Data, setStep1Data, setChecklistCategories } =
    useChecklistStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync: arrivalCheck } = useArrivalCheck();

  const [arrivalInfo, setArrivalInfo] = useState<ArrivalCheckResponse | null>(
    null,
  );

  // Search States
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const [vendorCategorySearch, setVendorCategorySearch] = useState('');
  const [debouncedVendorCategorySearch, setDebouncedVendorCategorySearch] =
    useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounce effects
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedVendorCategorySearch(vendorCategorySearch);
    }, 500);
    return () => clearTimeout(handler);
  }, [vendorCategorySearch]);

  // Vendors Query
  const {
    data: vendorData,
    fetchNextPage: fetchNextVendors,
    hasNextPage: hasNextVendors,
    isFetching: isFetchingVendors,
  } = useVendors({
    search: debouncedSearch,
    isActive: true,
  });

  const vendors = useMemo(() => {
    return (
      vendorData?.pages.flatMap((page) =>
        page.data.map((v) => ({
          label: `${v.company_name} (${v.vendor_code})`,
          value: String(v.vendor_id),
        })),
      ) || []
    );
  }, [vendorData]);

  // Vendor Categories Query
  const {
    data: vendorCategoryData,
    fetchNextPage: fetchNextVendorCategories,
    hasNextPage: hasNextVendorCategories,
    isFetching: isFetchingVendorCategories,
  } = useInfiniteVendorCategories({
    search: debouncedVendorCategorySearch,
  });

  const vendorCategories = useMemo(() => {
    return (
      vendorCategoryData?.pages.flatMap((page) =>
        page.data.map((m) => ({
          label: m.category_name,
          value: String(m.vendor_category_id),
          description: m.description || undefined,
        })),
      ) || []
    );
  }, [vendorCategoryData]);

  // Initial Selected Vendor from store
  const [selectedVendor, setSelectedVendor] = useState<{
    label: string;
    value: string;
  } | null>(() => {
    if (step1Data?.company.value) {
      return {
        label: step1Data.company.label,
        value: step1Data.company.value,
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

  const form = useForm({
    defaultValues: {
      fullName: step1Data?.fullName || '',
      company: {
        value: step1Data?.company.value || '',
        label: step1Data?.company.label || '',
      },
      vendorCategory: {
        value: step1Data?.vendorCategory?.value || '',
        label: step1Data?.vendorCategory?.label || '',
        description: step1Data?.vendorCategory?.description || '',
      },
      dnNumber: (step1Data?.dnNumber || '') as string | undefined,
      poNumber: (step1Data?.poNumber || '') as string | undefined,
    },
    validators: {
      onSubmit: VendorIdentitySchema as any,
    },
    onSubmit: async ({ value }) => {
      try {
        setIsSubmitting(true);
        // Using queryClient.fetchQuery to bridge the gap between imperative submit and declarative query
        const checklistData = await queryClient.fetchQuery({
          queryKey: ['checklist', Number(value.vendorCategory.value)],
          queryFn: () =>
            fetchChecklistByCategory(Number(value.vendorCategory.value)),
          staleTime: 60 * 1000,
        });

        // Arrival Check
        const arrivalData = await arrivalCheck(Number(value.company.value));

        setChecklistCategories(checklistData);
        setStep1Data({
          ...value,
          vendorCategory: value.vendorCategory,
          arrivalStatus: arrivalData.arrival_status,
        });

        if (arrivalData.arrival_status === 'Late') {
          router.push('/check-in/step-1b');
        } else {
          router.push('/check-in/step-2');
        }
      } catch (error) {
        console.error('Failed to fetch checklist', error);
        toast.error('Gagal memproses data', {
          description: 'Terjadi kesalahan pada sistem. Silakan coba lagi.',
        });
        setIsSubmitting(false);
      }
    },
  });

  const handleSelectVendor = async (value: string) => {
    const vendor = displayVendors.find((c) => c.value === value);
    setSelectedVendor(vendor || null);
    if (vendor) {
      form.setFieldValue('company.value', vendor.value);
      form.setFieldValue('company.label', vendor.label);

      // Trigger arrival check
      try {
        const data = await arrivalCheck(Number(vendor.value));
        setArrivalInfo(data);
      } catch (error) {
        console.error('Arrival check failed', error);
      }
    } else {
      setArrivalInfo(null);
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
            name="dnNumber"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <IconLabel
                    classNameIcon="w-6 h-6"
                    htmlFor="dnNumber"
                    icon={Box}
                  >
                    Delivery Note (DN) / Surat Jalan
                  </IconLabel>
                  <Input
                    className="h-12 vendor-text"
                    id="dnNumber"
                    type="text"
                    placeholder="misal: DN-12345"
                    autoComplete="off"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  <p className="text-sm text-gray-500">
                    Opsional, bisa di-scan jika ada barcode.
                  </p>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="poNumber"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <IconLabel
                    classNameIcon="w-6 h-6"
                    htmlFor="poNumber"
                    icon={Box}
                  >
                    Purchase Order (PO)
                  </IconLabel>
                  <Input
                    className="h-12 vendor-text"
                    id="poNumber"
                    type="text"
                    placeholder="misal: PO-98765"
                    autoComplete="off"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  <p className="text-sm text-gray-500">Opsional.</p>
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
                    onLoadMore={() => {
                      if (hasNextVendors) fetchNextVendors();
                    }}
                    isLoading={isFetchingVendors}
                  />

                  {arrivalInfo && (
                    <div
                      className={cn(
                        'mt-2 p-3 rounded-lg border flex items-center gap-3',
                        arrivalInfo.arrival_status === 'Late'
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : arrivalInfo.arrival_status === 'Unscheduled'
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-green-50 border-green-200 text-green-700',
                      )}
                    >
                      {arrivalInfo.arrival_status === 'Late' ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : arrivalInfo.arrival_status === 'Unscheduled' ? (
                        <Info className="w-5 h-5" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5" />
                      )}
                      <div className="text-sm">
                        <span className="font-bold">
                          {arrivalInfo.arrival_status === 'Late'
                            ? 'Terlambat'
                            : arrivalInfo.arrival_status === 'Unscheduled'
                              ? 'Tanpa Jadwal'
                              : 'Tepat Waktu'}
                        </span>
                        {arrivalInfo.planned_arrival_time && (
                          <span className="ml-1">
                            (Jadwal: {arrivalInfo.planned_arrival_time})
                          </span>
                        )}
                        {arrivalInfo.arrival_status === 'Late' && (
                          <p className="mt-0.5 opacity-80 italic text-xs">
                            Anda akan diminta mengisi alasan di tahap
                            berikutnya.
                          </p>
                        )}
                        {arrivalInfo.arrival_status === 'Unscheduled' && (
                          <p className="mt-0.5 opacity-80 italic text-xs">
                            Kedatangan Anda akan dicatat sebagai tanpa jadwal.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="vendorCategory.value"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <IconLabel
                    classNameIcon="w-6 h-6"
                    htmlFor="vendorCategory"
                    icon={Box}
                    required
                  >
                    Kategori Vendor
                  </IconLabel>
                  <DropdownVendorCategory
                    options={vendorCategories}
                    value={field.state.value}
                    onSelect={(val) => {
                      const mat = vendorCategories.find((m) => m.value === val);
                      if (mat) {
                        form.setFieldValue('vendorCategory.value', mat.value);
                        form.setFieldValue('vendorCategory.label', mat.label);
                        form.setFieldValue(
                          'vendorCategory.description',
                          mat.description || '',
                        );
                        // Trigger field-level validation and state change in TanStack Form
                        field.handleChange(mat.value);
                      }
                    }}
                    isLoading={isFetchingVendorCategories}
                    onSearch={setVendorCategorySearch}
                    onLoadMore={() => {
                      if (hasNextVendorCategories) fetchNextVendorCategories();
                    }}
                    hasMore={hasNextVendorCategories}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>
      </form>

      <CardFooter className="flex flex-row justify-between gap-2 px-0 pt-6">
        <Button
          disabled={isSubmitting}
          type="button"
          variant="outline"
          className="w-1/2 h-12 sm:h-14 text-sm sm:text-base"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-1 sm:mr-2 w-5 h-5 sm:w-6 sm:h-6" />
          Kembali
        </Button>
        <Button
          type="submit"
          form="vendor-identity-form"
          className="w-1/2 h-12 sm:h-14 text-sm sm:text-base"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Memuat...' : 'Lanjut'}
          <CircleArrowRight className="ml-1 sm:ml-2 w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
      </CardFooter>
    </>
  );
}
