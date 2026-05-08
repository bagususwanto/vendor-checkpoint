'use client';

import { useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import {
  createVendorCategorySchema,
  CreateVendorCategory,
} from '@repo/types';
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

const formSchema = createVendorCategorySchema;
type FormValues = CreateVendorCategory;

interface VendorCategoryFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: FormValues) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function VendorCategoryForm({
  defaultValues,
  onSubmit,
  isLoading,
  onCancel,
}: VendorCategoryFormProps) {
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
                <FieldLabel htmlFor="category_code" required>
                  Category Code
                </FieldLabel>
                <Input
                  id="category_code"
                  placeholder="Example: VC-001"
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
                <FieldLabel htmlFor="category_name" required>
                  Category Name
                </FieldLabel>
                <Input
                  id="category_name"
                  placeholder="Example: Logistics Vendor"
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
                <FieldLabel htmlFor="description" optional>
                  Description
                </FieldLabel>
                <Textarea
                  id="description"
                  placeholder="Vendor category description..."
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
              <Field
                orientation="horizontal"
                className="justify-between space-x-2"
              >
                <div className="flex-1 space-y-0.5">
                  <FieldLabel htmlFor="is_active">Active Status</FieldLabel>
                  <p className="text-[0.8rem] text-muted-foreground">
                    Deactivate if the category should not be displayed in options.
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
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

