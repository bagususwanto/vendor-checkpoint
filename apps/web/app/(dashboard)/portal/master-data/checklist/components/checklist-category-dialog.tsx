'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createChecklistCategorySchema,
  updateChecklistCategorySchema,
} from '@repo/types';
import {
  ChecklistCategoryResponse,
  CreateChecklistCategory,
} from '@/types/checklist';
import { checklistService } from '@/services/checklist.service';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldContent,
  FieldDescription,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface ChecklistCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: ChecklistCategoryResponse | null;
  onSuccess: () => void;
}

export function ChecklistCategoryDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: ChecklistCategoryDialogProps) {
  const form = useForm<CreateChecklistCategory>({
    resolver: zodResolver(
      category ? updateChecklistCategorySchema : createChecklistCategorySchema,
    ) as any,
    defaultValues: {
      category_name: '',
      category_code: '',
      description: '',
      icon_name: '',
      color_code: '',
      is_active: true,
      display_order: 0,
    } as CreateChecklistCategory,
  });

  useEffect(() => {
    if (category) {
      form.reset({
        category_name: category.category_name,
        category_code: category.category_code,
        description: category.description || '',
        icon_name: category.icon_name || '',
        color_code: category.color_code || '',
        is_active: category.is_active,
        display_order: category.display_order,
      });
    } else {
      form.reset({
        category_name: '',
        category_code: '',
        description: '',
        icon_name: '',
        color_code: '',
        is_active: true,
        display_order: 0,
      });
    }
  }, [category, form, open]);

  const onSubmit = async (data: CreateChecklistCategory) => {
    try {
      if (category) {
        await checklistService.updateCategory(
          category.checklist_category_id,
          data,
        );
        toast.success('Kategori berhasil diperbarui');
      } else {
        await checklistService.createCategory(data);
        toast.success('Kategori berhasil dibuat');
      }
      onSuccess();
    } catch (error) {
      toast.error(
        category ? 'Gagal memperbarui kategori' : 'Gagal membuat kategori',
      );
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Kategori' : 'Tambah Kategori'}
          </DialogTitle>
          <DialogDescription>
            {category
              ? 'Ubah informasi kategori checklist.'
              : 'Buat kategori checklist baru.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel required>Nama Kategori</FieldLabel>
            <FieldContent>
              <Input
                placeholder="Contoh: Dokumen"
                {...form.register('category_name')}
              />
            </FieldContent>
            <FieldError errors={[form.formState.errors.category_name]} />
          </Field>

          <Field>
            <FieldLabel required>Kode Kategori</FieldLabel>
            <FieldContent>
              <Input
                placeholder="Contoh: DOC"
                {...form.register('category_code')}
              />
            </FieldContent>
            <FieldError errors={[form.formState.errors.category_code]} />
          </Field>

          <Field>
            <FieldLabel>Deskripsi</FieldLabel>
            <FieldContent>
              <Textarea
                placeholder="Deskripsi singkat..."
                {...form.register('description')}
              />
            </FieldContent>
            <FieldError errors={[form.formState.errors.description]} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Icon Name</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="lucide-react icon..."
                  {...form.register('icon_name')}
                />
              </FieldContent>
              <FieldDescription>
                Reference:{' '}
                <a
                  href="https://lucide.dev/icons"
                  target="_blank"
                  rel="noreferrer"
                >
                  Lucide Icons
                </a>
              </FieldDescription>
              <FieldError errors={[form.formState.errors.icon_name]} />
            </Field>

            <Field>
              <FieldLabel>Color Code</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="text-red-500"
                  {...form.register('color_code')}
                />
              </FieldContent>
              <FieldDescription>
                Reference:{' '}
                <a
                  href="https://tailwindcss.com/docs/customizing-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  Tailwind Colors
                </a>
              </FieldDescription>
              <FieldError errors={[form.formState.errors.color_code]} />
            </Field>
          </div>

          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel>Status Aktif</FieldLabel>
            </FieldContent>
            <FieldContent className="flex flex-1 justify-end">
              <Switch
                checked={form.watch('is_active')}
                onCheckedChange={(checked) =>
                  form.setValue('is_active', checked)
                }
              />
            </FieldContent>
          </Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
