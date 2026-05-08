'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { DelayReasonResponse } from '@repo/types';
import { useCreateDelayReason, useUpdateDelayReason } from '@/hooks/api/use-delay-reasons';

const formSchema = z.object({
  reason_text: z.string().min(1, 'Reason text is required').max(255),
  is_active: z.boolean().default(true),
  category: z.enum(['Arrival', 'Departure']),
});

type FormValues = z.infer<typeof formSchema>;

interface ReasonFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason: DelayReasonResponse | null;
  defaultCategory: 'Arrival' | 'Departure';
}

export function ReasonForm({
  open,
  onOpenChange,
  reason,
  defaultCategory,
}: ReasonFormProps) {
  const createMutation = useCreateDelayReason();
  const updateMutation = useUpdateDelayReason();

  const isEditing = !!reason;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema as any) as any,
    defaultValues: {
      reason_text: '',
      is_active: true,
      category: defaultCategory,
    },
  });

  useEffect(() => {
    if (open) {
      if (reason) {
        form.reset({
          reason_text: reason.reason_text,
          is_active: reason.is_active,
          category: reason.category as 'Arrival' | 'Departure',
        });
      } else {
        form.reset({
          reason_text: '',
          is_active: true,
          category: defaultCategory,
        });
      }
    }
  }, [open, reason, form, defaultCategory]);

  const onSubmit = (values: FormValues) => {
    if (isEditing) {
      updateMutation.mutate(
        { id: reason!.delay_reason_id, data: values },
        {
          onSuccess: () => {
            toast.success('Reason updated successfully');
            onOpenChange(false);
          },
          onError: (error: any) => {
            toast.error('Failed to update reason', {
              description: error.message || 'A system error occurred',
            });
          },
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success('Reason added successfully');
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error('Failed to add reason', {
            description: error.message || 'A system error occurred',
          });
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Delay Reason' : 'Add Delay Reason'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Change the reason text or deactivate it so it doesn\'t appear in operational choices.'
              : `Create a new reason for category ${defaultCategory}.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel required>Reason Text</FieldLabel>
            <FieldContent>
              <Input placeholder="Example: Traffic jam on highway" {...form.register('reason_text')} />
            </FieldContent>
            <FieldError errors={[form.formState.errors.reason_text]} />
          </Field>

          <Field>
            <FieldLabel>Active Status</FieldLabel>
            <FieldContent className="flex items-center gap-2 mt-2">
              <Switch
                checked={form.watch('is_active')}
                onCheckedChange={(checked) => form.setValue('is_active', checked)}
              />
              <span className="text-sm text-muted-foreground">Display this reason in the system</span>
            </FieldContent>
          </Field>

          <div className="flex justify-end pt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
