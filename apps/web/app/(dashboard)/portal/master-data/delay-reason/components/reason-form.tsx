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
  reason_text: z.string().min(1, 'Teks alasan wajib diisi').max(255),
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
            toast.success('Alasan berhasil diperbarui');
            onOpenChange(false);
          },
          onError: (error: any) => {
            toast.error('Gagal memperbarui alasan', {
              description: error.message || 'Terjadi kesalahan sistem',
            });
          },
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success('Alasan berhasil ditambahkan');
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error('Gagal menambahkan alasan', {
            description: error.message || 'Terjadi kesalahan sistem',
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
            {isEditing ? 'Edit Alasan Keterlambatan' : 'Tambah Alasan Keterlambatan'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Ubah teks alasan atau non-aktifkan agar tidak muncul di pilihan operasional.'
              : `Buat alasan baru untuk kategori ${defaultCategory}.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel required>Teks Alasan</FieldLabel>
            <FieldContent>
              <Input placeholder="Contoh: Macet di tol" {...form.register('reason_text')} />
            </FieldContent>
            <FieldError errors={[form.formState.errors.reason_text]} />
          </Field>

          <Field>
            <FieldLabel>Status Aktif</FieldLabel>
            <FieldContent className="flex items-center gap-2 mt-2">
              <Switch
                checked={form.watch('is_active')}
                onCheckedChange={(checked) => form.setValue('is_active', checked)}
              />
              <span className="text-sm text-muted-foreground">Tampilkan alasan ini pada sistem</span>
            </FieldContent>
          </Field>

          <div className="flex justify-end pt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
