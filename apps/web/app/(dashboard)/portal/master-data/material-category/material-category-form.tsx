'use client';

import { useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { createMaterialCategorySchema } from '@repo/types';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Loader2 } from 'lucide-react';

const formSchema = createMaterialCategorySchema;
type FormValues = z.infer<typeof formSchema>;

interface MaterialCategoryFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: FormValues) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function MaterialCategoryForm({
  defaultValues,
  onSubmit,
  isLoading,
  onCancel,
}: MaterialCategoryFormProps) {
  const form = useForm({
    defaultValues: {
      category_code: defaultValues?.category_code || '',
      category_name: defaultValues?.category_name || '',
      description: defaultValues?.description || '',
      is_active: defaultValues?.is_active ?? true,
    },
    validators: {
      onSubmit: formSchema as any,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  // Effect to update default values if they come in late (e.g. edit mode fetch)
  // Note: TanStack form separates defaultValues (initial) from values.
  // Ideally, defaultValues shouldn't change, but if we need to reset/repopuplate:
  /*
  useEffect(() => {
    if (defaultValues) {
      // form.reset() or create a new form instance or manual field updates
      // Here we assume defaultValues are stable or component is remounted
    }
  }, [defaultValues]);
  */

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <FieldGroup>
        <form.Field
          name="category_code"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="category_code">Kode Kategori</FieldLabel>
                <Input
                  id="category_code"
                  placeholder="Contoh: MC-001"
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
          name="category_name"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="category_name">Nama Kategori</FieldLabel>
                <Input
                  id="category_name"
                  placeholder="Contoh: Bahan Baku"
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
          name="description"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="description">
                  Deskripsi (Opsional)
                </FieldLabel>
                <Textarea
                  id="description"
                  placeholder="Deskripsi kategori material..."
                  className="resize-none"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <form.Field
          name="is_active"
          children={(field) => {
            return (
              <Field className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FieldLabel htmlFor="is_active">Status Aktif</FieldLabel>
                  <p className="text-[0.8rem] text-muted-foreground">
                    Nonaktifkan jika kategori tidak ingin ditampilkan di opsi.
                  </p>
                </div>
                <Switch
                  checked={field.state.value}
                  onCheckedChange={field.handleChange}
                />
              </Field>
            );
          }}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={onCancel}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
