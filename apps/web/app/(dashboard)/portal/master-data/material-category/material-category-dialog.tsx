'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MaterialCategoryForm } from './material-category-form';
import {
  CreateMaterialCategory,
  MaterialCategoryResponse,
  UpdateMaterialCategory,
} from '@repo/types';

interface MaterialCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: MaterialCategoryResponse | null;
  onSubmit: (
    data: CreateMaterialCategory | UpdateMaterialCategory,
  ) => Promise<void>;
  isLoading: boolean;
}

export function MaterialCategoryDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
  isLoading,
}: MaterialCategoryDialogProps) {
  const isEdit = !!category;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Kategori Material' : 'Tambah Kategori Material'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Ubah informasi kategori material di sini.'
              : 'Tambahkan kategori material baru ke dalam sistem.'}
          </DialogDescription>
        </DialogHeader>
        <MaterialCategoryForm
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
