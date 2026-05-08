'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createChecklistItemSchema,
  updateChecklistItemSchema,
  ChecklistItemType,
} from '@repo/types';
import { ChecklistItemResponse, CreateChecklistItem } from '@/types/checklist';
import { useVendorCategorySelection } from '@/hooks/api/use-vendor-categories';
// ... (keep intermediate lines if possible or replace larger chunk)
// actually I will use multiple replace chunks to be safe

// ...
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
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ChecklistItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: number | null;
  item: ChecklistItemResponse | null;
  onSuccess: () => void;
}

export function ChecklistItemDialog({
  open,
  onOpenChange,
  categoryId,
  item,
  onSuccess,
}: ChecklistItemDialogProps) {
  const { data: materialCategories } = useVendorCategorySelection();

  const form = useForm<CreateChecklistItem>({
    resolver: zodResolver(createChecklistItemSchema) as any,
    defaultValues: {
      checklist_category_id: categoryId || 0,
      item_text: '',
      item_code: '',
      item_type: ChecklistItemType.GENERAL,
      display_order: 0,
      is_required: true,
      is_active: true,
      vendor_category_id: undefined,
    } as CreateChecklistItem,
  });

  useEffect(() => {
    if (item) {
      form.reset({
        checklist_category_id: item.checklist_category_id,
        item_text: item.item_text,
        item_code: item.item_code,
        item_type: item.item_type as any,
        display_order: item.display_order,
        is_required: item.is_required,
        is_active: item.is_active,
        vendor_category_id: item.vendor_category_id ?? undefined,
      });
    } else if (categoryId) {
      // Reset only if switching to create mode, keeping categoryId
      form.reset({
        checklist_category_id: categoryId,
        item_text: '',
        item_code: '',
        item_type: ChecklistItemType.GENERAL,
        display_order: 0,
        is_required: true,
        is_active: true,
        vendor_category_id: undefined,
      });
    }
  }, [item, categoryId, form, open]);

  const onSubmit = async (data: CreateChecklistItem) => {
    try {
      if (item) {
        await checklistService.updateItem(item.checklist_item_id, data);
        toast.success('Item berhasil diperbarui');
      } else {
        await checklistService.createItem(data);
        toast.success('Item created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(item ? 'Failed to update item' : 'Failed to create item');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Item' : 'Add Item'}</DialogTitle>
          <DialogDescription>
            {item
              ? 'Change checklist item information.'
              : 'Create a new checklist item for this category.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel required>Item Text (Question)</FieldLabel>
            <FieldContent>
              <Input
                placeholder="Does the driver use PPE?"
                {...form.register('item_text')}
              />
            </FieldContent>
            <FieldError errors={[form.formState.errors.item_text]} />
          </Field>

          <Field>
            <FieldLabel required>Item Code</FieldLabel>
            <FieldContent>
              <Input placeholder="ITEM-001" {...form.register('item_code')} />
            </FieldContent>
            <FieldError errors={[form.formState.errors.item_code]} />
          </Field>

          <Field>
            <FieldLabel required>Input Type</FieldLabel>
            <FieldContent>
              <RadioGroup
                onValueChange={(value) =>
                  form.setValue('item_type', value as any)
                }
                value={form.watch('item_type')}
                className="flex gap-4 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={ChecklistItemType.GENERAL} id="general" />
                  <Label htmlFor="general" className="font-normal cursor-pointer">
                    General
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={ChecklistItemType.SPECIFIC}
                    id="specific"
                  />
                  <Label
                    htmlFor="specific"
                    className="font-normal cursor-pointer"
                  >
                    Specific
                  </Label>
                </div>
              </RadioGroup>
            </FieldContent>
            <FieldError errors={[form.formState.errors.item_type]} />
          </Field>

          {form.watch('item_type') === ChecklistItemType.SPECIFIC && (
            <div className="py-2">
              <Field>
                <FieldLabel required>Vendor Category</FieldLabel>
                <FieldContent>
                  <Select
                    onValueChange={(value) =>
                      form.setValue('vendor_category_id', Number(value))
                    }
                    defaultValue={
                      form.watch('vendor_category_id')
                        ? String(form.watch('vendor_category_id'))
                        : undefined
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select vendor category" />
                    </SelectTrigger>
                    <SelectContent>
                      {materialCategories?.map((category) => (
                        <SelectItem
                          key={category.vendor_category_id}
                          value={String(category.vendor_category_id)}
                        >
                          {category.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldContent>
                <FieldError
                  errors={[form.formState.errors.vendor_category_id]}
                />
              </Field>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 py-2">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel>Required</FieldLabel>
              </FieldContent>
              <FieldContent className="flex flex-1 justify-end">
                <Switch
                  checked={form.watch('is_required')}
                  onCheckedChange={(checked) =>
                    form.setValue('is_required', checked)
                  }
                />
              </FieldContent>
            </Field>

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

          {/* Note: Material Category selection can be added here if needed, 
                but for now keeping it simple as 'optional' default null (Umum) 
            */}

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
