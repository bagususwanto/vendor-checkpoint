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
import { vendorService } from '@/services/vendor.service';
import { checklistService } from '@/services/checklist.service';
import { materialCategoryService } from '@/services/material-category.service';
import { DropdownMaterialCategory } from '@/components/dropdown-material-category';
import { Box } from 'lucide-react';

export function VendorIdentityForm() {
  const { step1Data, setStep1Data, setChecklistCategories } =
    useChecklistStore();
  const router = useRouter();

  const [vendors, setVendors] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Material Category State
  const [materialCategories, setMaterialCategories] = useState<any[]>([]);
  const [materialCategoryPage, setMaterialCategoryPage] = useState(1);
  const [hasMoreMaterialCategories, setHasMoreMaterialCategories] = useState(true);
  const [isMaterialCategoryLoading, setIsMaterialCategoryLoading] = useState(false);
  const [materialCategorySearch, setMaterialCategorySearch] = useState('');
  const [debouncedMaterialCategorySearch, setDebouncedMaterialCategorySearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedMaterialCategorySearch(materialCategorySearch);
    }, 500);
    return () => clearTimeout(handler);
  }, [materialCategorySearch]);

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

  const fetchVendors = async (
    currentPage: number,
    searchTerm: string,
    isNewSearch: boolean,
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
        label: `${v.company_name} (${v.vendor_code})`,
        value: String(v.vendor_id),
      }));

      setVendors((prev) =>
        isNewSearch ? newVendors : [...prev, ...newVendors],
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

  const fetchMaterialCategories = async (
    currentPage: number,
    searchTerm: string,
    isNewSearch: boolean,
  ) => {
    if (!isNewSearch && isMaterialCategoryLoading) return;

    setIsMaterialCategoryLoading(true);
    try {
      const data = await materialCategoryService.getMaterialCategories({
        page: currentPage,
        limit: 10,
        search: searchTerm,
      });
      const newMaterialCategories = data.data.map((m) => ({
        label: m.category_name,
        value: String(m.material_category_id),
        description: m.description,
      }));

      setMaterialCategories((prev) =>
        isNewSearch ? newMaterialCategories : [...prev, ...newMaterialCategories],
      );

      const { total, limit, page: metaPage } = data.meta;
      const totalPages = Math.ceil(total / limit);
      setHasMoreMaterialCategories(metaPage < totalPages);
    } catch (e) {
      console.error('Failed to fetch material categories', e);
    } finally {
      setIsMaterialCategoryLoading(false);
    }
  };

  useEffect(() => {
    setMaterialCategoryPage(1);
    fetchMaterialCategories(1, debouncedMaterialCategorySearch, true);
  }, [debouncedMaterialCategorySearch]);

  const handleLoadMoreMaterialCategories = () => {
    if (!isMaterialCategoryLoading && hasMoreMaterialCategories) {
      const nextPage = materialCategoryPage + 1;
      setMaterialCategoryPage(nextPage);
      fetchMaterialCategories(nextPage, debouncedMaterialCategorySearch, false);
    }
  };

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
        label: step1Data?.company.label || ''
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
        const checklistData = await checklistService.getChecklistByCategory(
          Number(value.materialCategory.value),
        );
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
                    onLoadMore={handleLoadMore}
                    isLoading={isLoading}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="materialCategory.value"
            children={(field) => {
               const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
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
                       const mat = materialCategories.find((m) => m.value === val);
                       if (mat) {
                         form.setFieldValue('materialCategory.value', mat.value);
                         form.setFieldValue('materialCategory.label', mat.label);
                         form.setFieldValue('materialCategory.description', mat.description || '');
                       }
                     }}
                     isLoading={isMaterialCategoryLoading}
                     onSearch={setMaterialCategorySearch}
                     onLoadMore={handleLoadMoreMaterialCategories}
                     hasMore={hasMoreMaterialCategories}
                   />
                   {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
               )
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
