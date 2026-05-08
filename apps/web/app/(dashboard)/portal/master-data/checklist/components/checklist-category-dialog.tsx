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
        toast.success('Category updated successfully');
      } else {
        await checklistService.createCategory(data);
        toast.success('Category created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(
        category ? 'Failed to update category' : 'Failed to create category',
      );
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Category' : 'Add Category'}
          </DialogTitle>
          <DialogDescription>
            {category
              ? 'Change checklist category information.'
              : 'Create a new checklist category.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel required>Category Name</FieldLabel>
            <FieldContent>
              <Input
                placeholder="Example: Documents"
                {...form.register('category_name')}
              />
            </FieldContent>
            <FieldError errors={[form.formState.errors.category_name]} />
          </Field>

          <Field>
            <FieldLabel required>Category Code</FieldLabel>
            <FieldContent>
              <Input
                placeholder="Example: DOC"
                {...form.register('category_code')}
              />
            </FieldContent>
            <FieldError errors={[form.formState.errors.category_code]} />
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <FieldContent>
              <Textarea
                placeholder="Short description..."
                {...form.register('description')}
              />
            </FieldContent>
            <FieldError errors={[form.formState.errors.description]} />
          </Field>

          <div className="grid grid-cols-2 gap-4 py-2">
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

          <div className="py-2">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel>Active Status</FieldLabel>
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
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
