'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VendorCategoryForm } from './vendor-category-form';
import {
  CreateVendorCategory,
  VendorCategoryResponse,
  UpdateVendorCategory,
} from '@repo/types';

interface VendorCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: VendorCategoryResponse | null;
  onSubmit: (
    data: CreateVendorCategory | UpdateVendorCategory,
  ) => Promise<void>;
  isLoading: boolean;
}

export function VendorCategoryDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
  isLoading,
}: VendorCategoryDialogProps) {
  const isEdit = !!category;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Vendor Category' : 'Add Vendor Category'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Change vendor category information here.'
              : 'Add a new vendor category to the system.'}
          </DialogDescription>
        </DialogHeader>
        <VendorCategoryForm
          defaultValues={
            category
              ? {
                  ...category,
                  description: category.description || '',
                }
              : {}
          }
          onSubmit={onSubmit}
          isLoading={isLoading}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

