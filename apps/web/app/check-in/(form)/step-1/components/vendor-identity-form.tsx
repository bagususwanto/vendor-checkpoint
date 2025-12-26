'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Building2, CircleArrowRight, User, Box } from 'lucide-react';
import { ComboboxVendor } from '@/components/combobox-vendor';
import IconLabel from '@/components/icon-label';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { VendorIdentitySchema } from '@/lib/schemas/vendor-identity.schema';
import { useChecklistStore } from '@/stores/use-checklist.store';
import { checklistService } from '@/services/checklist.service';
import { DropdownMaterialCategory } from '@/components/dropdown-material-category';
import { useVendors } from '@/hooks/api/use-vendors';
import { useMaterialCategories } from '@/hooks/api/use-material-categories';

export function VendorIdentityForm() {
  const { step1Data, setStep1Data, setChecklistCategories } = useChecklistStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Search States
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const [materialCategorySearch, setMaterialCategorySearch] = useState('');
  const [debouncedMaterialCategorySearch, setDebouncedMaterialCategorySearch] =
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
      setDebouncedMaterialCategorySearch(materialCategorySearch);
    }, 500);
    return () => clearTimeout(handler);
  }, [materialCategorySearch]);

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
        }))
      ) || []
    );
  }, [vendorData]);

  // Material Categories Query
  const {
    data: materialData,
    fetchNextPage: fetchNextMaterialCategories,
    hasNextPage: hasNextMaterialCategories,
    isFetching: isFetchingMaterialCategories,
  } = useMaterialCategories({
    search: debouncedMaterialCategorySearch,
  });

  const materialCategories = useMemo(() => {
    return (
      materialData?.pages.flatMap((page) =>
        page.data.map((m) => ({
          label: m.category_name,
          value: String(m.material_category_id),
          description: m.description,
        }))
      ) || []
    );
  }, [materialData]);

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
      materialCategory: {
        value: step1Data?.materialCategory?.value || '',
        label: step1Data?.materialCategory?.label || '',
        description: step1Data?.materialCategory?.description || '',
      },
    },
    validators: {
      onSubmit: VendorIdentitySchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setIsSubmitting(true);
        // Using queryClient.fetchQuery to bridge the gap between imperative submit and declarative query
        const checklistData = await queryClient.fetchQuery({
          queryKey: ['checklist', Number(value.materialCategory.value)],
          queryFn: () =>
            checklistService.getChecklistByCategory(
              Number(value.materialCategory.value)
            ),
          staleTime: 60 * 1000,
        });

        setChecklistCategories(checklistData);
        setStep1Data(value);
        router.push('/check-in/step-2');
      } catch (error) {
        console.error('Failed to fetch checklist', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleSelectVendor = (value: string) => {
    const vendor = displayVendors.find((c) => c.value === value);
    setSelectedVendor(vendor || null);
    if (vendor) {
      form.setFieldValue('company.value', vendor.value);
      form.setFieldValue('company.label', vendor.label);
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
                    onLoadMore={() => {
                        if (hasNextVendors) fetchNextVendors();
                    }}
                    isLoading={isFetchingVendors}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="materialCategory.value"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <IconLabel
                    classNameIcon="w-6 h-6"
                    htmlFor="materialCategory"
                    icon={Box}
                    required
                  >
                    Kategori Material
                  </IconLabel>
                  <DropdownMaterialCategory
                    options={materialCategories}
                    value={field.state.value}
                    onSelect={(val) => {
                      const mat = materialCategories.find(
                        (m) => m.value === val
                      );
                      if (mat) {
                        form.setFieldValue('materialCategory.value', mat.value);
                        form.setFieldValue('materialCategory.label', mat.label);
                        form.setFieldValue(
                          'materialCategory.description',
                          mat.description || ''
                        );
                      }
                    }}
                    isLoading={isFetchingMaterialCategories}
                    onSearch={setMaterialCategorySearch}
                    onLoadMore={() => {
                        if (hasNextMaterialCategories) fetchNextMaterialCategories();
                    }}
                    hasMore={hasNextMaterialCategories}
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
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Memuat...' : 'Lanjut'}
          <CircleArrowRight className="ml-2 w-6 h-6" />
        </Button>
      </CardFooter>
    </>
  );
}
